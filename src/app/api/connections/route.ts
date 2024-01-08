import {ConnectionData} from "@/types/api-responses/ConnectionData";
import ConnectionsManager from "@/app/api/connections/ConnectionsManager";

import {Query} from "mysql2";

import { NextResponse } from "next/server";

export function GET(_: Request) {
	const data: ConnectionData = [];

	for (const name of ConnectionsManager.connectionNames) {
		const table: Query[] | undefined = ConnectionsManager.queryConnection(name, [
			`SELECT TABLE_NAME, COLUMN_NAME, COLUMN_DEFAULT, IS_NULLABLE, COLUMN_TYPE, COLUMN_KEY, EXTRA FROM information_schema.COLUMNS;`
		]);

		if (table === undefined) {
			NextResponse.json({
				message: "One or more connections are not available."
			}, {
				status: 500
			});
			return;
		}


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