import {Connection} from "@/types/api-responses/ConnectionData";
import ConnectionsManager, {CMOptions} from "@/managers/ConnectionsManager";

import {QueryError} from "mysql2";
import {Packets} from "@/types/TypeDefinitions";

import {NextRequest, NextResponse} from "next/server";
import {BaseResponse} from "@/types/api-responses/BaseResponse";
import {SqlOn} from "@/types/api-responses/RunSql";

// map database connections
export async function GET(_: NextRequest): Promise<NextResponse<BaseResponse<string | { [name: string]: Connection }>>> {
	const databases: { [name: string]: Connection } = {};

	for (const name of ConnectionsManager.connectionNames) {
		const rowResult: Packets[] | undefined = await ConnectionsManager.queryConnection(name,
			`SELECT 
				TABLE_SCHEMA AS database_name,
				TABLE_NAME AS table_name,
				COLUMN_NAME AS column_name,
				COLUMN_TYPE AS column_type,
				IS_NULLABLE = 'NO' AS is_not_null,
				COLUMN_KEY = 'PRI' AS is_primary_key,
				COLUMN_KEY = 'UNI' AS is_unique,
				EXTRA LIKE '%auto_increment%' AS is_auto_increment,
				COLUMN_DEFAULT AS default_value
			FROM
				INFORMATION_SCHEMA.COLUMNS
			ORDER BY
				TABLE_SCHEMA,
				TABLE_NAME,
				ORDINAL_POSITION;`
		);

		if (rowResult === undefined)
			continue;

		const connection: Connection = {
			databases: {},
		};

		for (let row of rowResult[0] as any) {
			const dbName: string = row["database_name"];
			const tableName: string = row["table_name"];
			const columnName: string = row["column_name"];

			if (!(dbName in connection.databases)) {
				connection.databases[dbName] = {
					tables: {},
					routines: {},
					triggers: {},
					views: {}
				}
			}

			if (!(tableName in connection.databases[dbName].tables)) {
				connection.databases[dbName].tables[tableName] = {
					columns: {}
				}
			}

			connection.databases[dbName].tables[tableName].columns[columnName] = {
				type: row["column_type"],
				notNull: row["is_not_null"] === 1,
				unique: row["is_unique"] === 1,
				autoIncrement: row["is_auto_increment"] === 1,
				default: row["default_value"] === "" ? null : row["default_value"],
				primaryKey: row["is_primary_key"] === 1,
			}
		}

		databases[name] = connection;
	}

	return NextResponse.json({ success: true, message: databases });
}

// create new database connection
export async function POST(request: NextRequest): Promise<NextResponse<BaseResponse<string | null>>> {
	const json: CMOptions = await request.json();

	if (!("connection_name" in json))
		return NextResponse.json({ success: false, message: "No property name found in the body.", err: null }, { status: 400 });

	if (json.host?.toLowerCase() === "localhost" || json.host === "127.0.0.1")
		return NextResponse.json({ success: false, message: "Localhost and/or 127.0.0.1 are invalid addresses for a remote host." })

	try {
		await ConnectionsManager.addConnection(json);
	} catch (error: unknown) {
		return NextResponse.json({ success: false, message: (<QueryError>error).message }, { status: 400 });
	}

	return NextResponse.json({ success: true, message: null }, { status: 201 });
}

// run sql on a database connection
export async function PUT(request: NextRequest): Promise<NextResponse<BaseResponse<string | Packets[]>>> {
	const json: SqlOn = await request.json();

	let result: Packets[] | undefined;
	try {
		result = await ConnectionsManager.queryConnection(json.connection, ...json.sql);
	} catch (error: any) {
		return NextResponse.json({ success: false, message: error })
	}

	return result === undefined
		? NextResponse.json({
			success: false,
			message: "The connection name is not a valid connection name."
		}, {status: 400})
		: NextResponse.json({
			success: true,
			message: result
		});

}