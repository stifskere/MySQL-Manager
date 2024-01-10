import {NextRequest, NextResponse} from "next/server";

import mysql2Package from "mysql2/package.json";
import ConnectionsManager from "@/managers/ConnectionsManager";

export function GET(req: NextRequest) {
	let query: string | null = req.nextUrl.searchParams.get("query");

	if (query === null)
		return NextResponse.json({ message: "No query parameter passed." }, { status: 400 });

	query = decodeURIComponent(query);

	if (query === "driver_version") {
		return new NextResponse(`mysql2 ${mysql2Package.version}`);
	}

	if (query === "database_names") {
		return NextResponse.json(ConnectionsManager.connectionNames);
	}

	return NextResponse.json({ message: "No results found for your query." }, { status: 404 })
}