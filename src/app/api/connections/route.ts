import {ConnectionData} from "@/types/api-responses/ConnectionData";
import ConnectionsManager, {CMOptions} from "@/app/api/connections/ConnectionsManager";

import {Query} from "mysql2";

import { NextResponse } from "next/server";

export function GET(_: Request): NextResponse {
	const data: ConnectionData = [];

	for (const name of ConnectionsManager.connectionNames) {
		const table: Query[] | undefined = ConnectionsManager.queryConnection(name, [
			`SELECT TABLE_NAME, COLUMN_NAME, COLUMN_DEFAULT, IS_NULLABLE, COLUMN_TYPE, COLUMN_KEY, EXTRA FROM information_schema.COLUMNS;`
		]);

		console.log(name);

		if (table === undefined)
			return NextResponse.json({
				message: "One or more connections are not available."
			}, {
				status: 500
			});

		data.push({
			name,
			tables: table.map((column: any) => ({
				columns: [{
					name: column.COLUMN_NAME,
					type: column.COLUMN_TYPE,
					notNull: column.IS_NULLABLE === 'NO',
					unique: column.COLUMN_KEY === 'UNI',
					autoIncrement: column.EXTRA === 'auto_increment',
					default: column.COLUMN_DEFAULT !== null,
					primaryKey: column.COLUMN_KEY === 'PRI',
				}]
			}))
		});
	}

	return NextResponse.json(data);
}

export async function PUT(req: Request): Promise<NextResponse> {
	const json: { [key: string]: any } = await req.json();

	if (!("name" in json))
		return NextResponse.json({ success: false, message: "No property name found in the body." }, { status: 400 });

	try {
		ConnectionsManager.addConnection(json as CMOptions);
	} catch(error: any) {
		return NextResponse.json({ success: false, message: `There was an error while creating a connection to ${json.name}` }, { status: 400 });
	}

	return NextResponse.json({ success: true }, { status: 201 });
}