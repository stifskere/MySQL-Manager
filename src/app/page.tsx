"use client";

import {MutableRefObject, ReactElement, useRef, useState} from "react";
import {Packets, StateTuple} from "@/types/TypeDefinitions";
import {BaseResponse} from "@/types/api-responses/BaseResponse";

import ResultsViewer, {DatabaseResult} from "@/components/main/ResultsViewer";

import NavBar from "@/components/main/NavBar";
import SqlEditor from "@/components/main/SqlEditor";
import BottomBar from "@/components/main/BottomBar";
import DatabaseNavigator from "@/components/main/DatabaseNavigator";

import {DateTime} from "luxon";

import "./page.css";

// TODO: prettify connection map
// TODO: solve the bottom bar sync problems
// TODO: add sessions
// TODO: NOT IMPORTANT; add so you can move files from positions

export default function Home(): ReactElement {
	const sqlCode: MutableRefObject<string> = useRef<string>("");
	const [results, setResults]: StateTuple<DatabaseResult[]> = useState<DatabaseResult[]>([]);

	function updateSql(sql: string): void {
		sqlCode.current = sql;
	}

	async function onRunCode(connection: string): Promise<void> {
		const result: BaseResponse<string | Packets[]> = await fetch("/api/connections", { method: "PUT", body: JSON.stringify(
			{
				connection: connection,
				sql: sqlCode.current.split(';').reduce((acc: string[], i: string): string[] => (i ? [...acc, i] : acc), [])
			})
		}).then((r: Response): Promise<BaseResponse<string | Packets[]>> => r.json());

		if (result.message === undefined || typeof result.message === "string")
			return;

		if (!Array.isArray(result.message))
			result.message = [result.message];

		let resultingArray: DatabaseResult[] = [...results];
		for (let packet: number = 0, count: number = 0; packet < result.message.length; packet++)
			if ((Array.isArray(result.message[packet])) && (result.message[packet] as unknown[]).length > 0 || "errno" in result.message[packet])
				resultingArray = [...resultingArray, { time: DateTime.now(), content: result.message[packet], index: count++ }];

		setResults(resultingArray);
	}

	return (
		<main className="main-container">
			<NavBar onRun={onRunCode}/>
			<div className="main-horizontal">
				<DatabaseNavigator />
				<div className="main-vertical">
					<SqlEditor onChangeSql={updateSql}/>
					<ResultsViewer results={results} setResults={setResults}/>
				</div>
			</div>
			<BottomBar />
		</main>
	)
}
