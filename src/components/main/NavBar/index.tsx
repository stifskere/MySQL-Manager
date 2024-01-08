import { ReactElement, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { ConnectionData, Connection } from "@/types/api-responses/ConnectionData";

import "./index.css";

import {faPlay} from "@fortawesome/free-solid-svg-icons";
import NewConnectionModal from "@/components/main/modals/NewConnection";

interface Props {
	onRun: ((connection: string) => void);
}

export default function NavBar({onRun}: Props): ReactElement {
	const [connections, setConnections] = useState<ConnectionData>();
	const [currentModal, setCurrentModal] = useState<string | undefined>(undefined);

	useEffect((): void => {
		fetch("/api/connections", { method: "GET" })
			.then(r => r.json())
			.then(d => setConnections(d));
	}, []);

	function runHandler(): void {
		const element: HTMLSelectElement = document.getElementById("nav-bar-connection-select") as HTMLSelectElement;
		const option: HTMLOptionElement = element.item(element.selectedIndex)!;

		onRun(option.text);
	}

	const disabled: boolean = connections === undefined || connections.length === 0;

	return (
		<>
			<NewConnectionModal shown={false}/>
			<nav className="nav-bar-main">
				<div className="nav-bar-button-container">
					<a href="/new-connection" className="nav-bar-anchor">new connection</a>
					<a href="/" className="nav-bar-anchor">about this</a>
				</div>
				<div className="nav-bar-button-container">
					<FontAwesomeIcon icon={faPlay} className={`nav-bar-play${disabled ? "-disabled" : ""} fa-xl`} onClick={runHandler}/>
					<select id="nav-bar-connection-select" disabled={disabled} className="nav-bar-options">
						{connections === undefined
							? (<option>loading...</option>)
							: ( connections.length === 0
								? (<option>No connections</option>)
								: connections.map((connection: Connection, index: number): ReactElement => (<option key={index}>{connection.name}</option>)))
						}
					</select>
				</div>
			</nav>
		</>
	);
}