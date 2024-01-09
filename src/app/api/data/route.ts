import {NextRequest, NextResponse} from "next/server";

import mysql2Package from "mysql2/package.json";

export function GET(req: NextRequest) {
	const query: string | null = req.nextUrl.searchParams.get("query");

	if (query === null)
		return NextResponse.json({ message: "No query parameter passed." }, { status: 400 });

	if (query === "driver_version") {
		return NextResponse.json(`mysql2 ${mysql2Package.version}`);
	}

	return NextResponse.json({ message: "No results found for your query." }, { status: 404 })
}