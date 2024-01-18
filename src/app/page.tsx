"use client";

import {MutableRefObject, ReactElement, useRef} from "react";

import NavBar from "@/components/main/NavBar";
import SqlEditor from "@/components/main/SqlEditor";
import BottomBar from "@/components/main/BottomBar";
import DatabaseNavigator from "@/components/main/DatabaseNavigator";

import "./page.css";

// TODO: prettify connection map
// TODO: solve the bottom bar sync problems
// TODO: add sessions
// TODO: map results
// TODO: NOT IMPORTANT; add so you can move files from positions

export default function Home(): ReactElement {
	const sqlCode: MutableRefObject<string> = useRef("");

	function updateSql(sql: string): void {
		sqlCode.current = sql;
	}

	async function onRunCode(connection: string): Promise<void> {
		await fetch("/api/connections", { method: "PUT", body: JSON.stringify(
			{
				connection: connection,
				sql: sqlCode.current.split(';').reduce((acc: string[], i: string): string[] => (i ? [...acc, i] : acc), [])
			})
		});
	}

	return (
		<main className="main-container">
			<NavBar onRun={onRunCode}/>
			<div className="main-horizontal">
				<DatabaseNavigator />
				<div className="main-vertical">
					<SqlEditor onChangeSql={updateSql}/>
					<div className="base-container-style main-console" />
				</div>
			</div>
			<BottomBar />
		</main>
	)
}
