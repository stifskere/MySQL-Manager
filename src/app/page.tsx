"use client";

import {MutableRefObject, ReactElement, useRef} from "react";

import ResultsViewer, {DatabaseResult} from "@/components/main/ResultsViewer";

import NavBar from "@/components/main/NavBar";
import SqlEditor from "@/components/main/SqlEditor";
import BottomBar from "@/components/main/BottomBar";
import DatabaseNavigator from "@/components/main/DatabaseNavigator";

import "./page.css";
import {BaseResponse} from "@/types/api-responses/BaseResponse";
import {Packets} from "@/types/TypeDefinitions";
import {DateTime} from "luxon";

// TODO: prettify connection map
// TODO: solve the bottom bar sync problems
// TODO: add sessions
// TODO: map results
// TODO: NOT IMPORTANT; add so you can move files from positions

export default function Home(): ReactElement {
	const sqlCode: MutableRefObject<string> = useRef<string>("");
	const resultTabs: MutableRefObject<DatabaseResult[]> = useRef<DatabaseResult[]>([]); // TODO: see what going on with re renders and values

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

		resultTabs.current.push({
			time: DateTime.now(),
			content: result.message!
		});
	}

	return (
		<main className="main-container">
			<NavBar onRun={onRunCode}/>
			<div className="main-horizontal">
				<DatabaseNavigator />
				<div className="main-vertical">
					<SqlEditor onChangeSql={updateSql}/>
					<ResultsViewer results={resultTabs}/>
				</div>
			</div>
			<BottomBar />
		</main>
	)
}
