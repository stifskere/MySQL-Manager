import React, { ReactElement, useEffect, useState } from "react";
import { StateTuple } from "@/types/TypeDefinitions";

import { FaPlay } from "react-icons/fa";

import NewConnectionModal from "@/components/modals/NewConnectionModal";
import AboutModal from "@/components/modals/AboutModal";

import bottomBarManager from "@/managers/BottomBarManager";

import "./index.css";

interface Props {
	onRun: ((connection: string) => void);
}

export default function NavBar({onRun}: Props): ReactElement {
	const [connections, setConnections]: StateTuple<string[] | undefined> = useState<string[]>();
	const [currentModal, setCurrentModal]: StateTuple<ReactElement | undefined> = useState<ReactElement>();

	useEffect((): void => {
		bottomBarManager.addTask("fetch-connections", "Fetching connections");
		fetch("/api/data?query=database_names", { method: "GET" })
			.then((r: Response): Promise<string[]> => r.json())
			.then((d: string[]): void => setConnections(d))
			.then(() => bottomBarManager.removeTask("fetch-connections"));
	}, []);

	function runHandler(): void {
		const element: HTMLSelectElement = document.getElementById("nav-bar-connection-select") as HTMLSelectElement;
		const option: HTMLOptionElement = element.item(element.selectedIndex)!;

		onRun(option.text);
	}

	function setModal(modal: ReactElement | undefined): (() => void) {
		return (): void => {
			setCurrentModal(modal);
		};
	}

	const disabled: boolean = connections === undefined || connections.length === 0;

	return (
		<>
			{currentModal !== undefined && currentModal}
			<nav className="nav-bar-main">
				<div className="nav-bar-button-container">
					<button onClick={setModal(<NewConnectionModal onCancel={setModal(undefined)} />)} className="nav-bar-button">New connection</button>
					<button onClick={setModal(<AboutModal onCancel={setModal(undefined)} />)} className="nav-bar-button">About this</button>
				</div>
				<div className="nav-bar-button-container">
					<FaPlay className={`nav-bar-play${disabled ? "-disabled" : ""} fa-xl`} onClick={runHandler}/>
					<select id="nav-bar-connection-select" disabled={disabled} className="nav-bar-options">
						{connections === undefined
							? (<option>loading...</option>)
							: ( connections.length === 0
								? (<option>No connections</option>)
								: connections.map((connectionName: string, index: number): ReactElement => (<option key={index}>{connectionName}</option>)))
						}
					</select>
				</div>
			</nav>
		</>
	);
}