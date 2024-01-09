"use client";

import NavBar from "@/components/main/NavBar";
import SqlEditor from "@/components/main/SqlEditor";
import BottomBar from "@/components/main/BottomBar";

import "./page.css";

export default function Home() {
	function onRunCode(connection: string): void {
		console.log(connection);
	}

	return (
		<main className="main-container">
			<NavBar onRun={onRunCode}/>
			<div className="main-horizontal">
				<div className="base-container-style main-file-explorer"></div>
				<div className="main-vertical">
					<SqlEditor/>
					<div className="base-container-style main-console" />
				</div>
			</div>
			<BottomBar />
		</main>
	)
}
