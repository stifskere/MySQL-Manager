"use client";

import {ReactElement} from "react";

import NavBar from "@/components/main/NavBar";
import SqlEditor from "@/components/main/SqlEditor";
import BottomBar from "@/components/main/BottomBar";
import DatabaseNavigator from "@/components/main/DatabaseNavigator";

import "./page.css";

// TODO: replace everything for react icons.

export default function Home(): ReactElement {
	function onRunCode(connection: string): void {
		console.log(connection);
	}

	return (
		<main className="main-container">
			<NavBar onRun={onRunCode}/>
			<div className="main-horizontal">
				<DatabaseNavigator className="base-container-style main-connection-explorer" />
				<div className="main-vertical">
					<SqlEditor/>
					<div className="base-container-style main-console" />
				</div>
			</div>
			<BottomBar />
		</main>
	)
}
