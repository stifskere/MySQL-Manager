import {ReactElement, useEffect, useState} from "react";
import {StateTuple} from "@/types/TypeDefinitions";

import bottomBarManager from "@/managers/BottomBarManager";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretRight, faCaretUp, faCircleCheck, faDatabase, faSpinner} from "@fortawesome/free-solid-svg-icons";

import {ProgressBar} from "primereact/progressbar";

import "./index.css";

// TODO: finish task scheduling view.

export default function BottomBar(): ReactElement {
	const [version, setVersion]: StateTuple<string | undefined> = useState<string | undefined>(undefined);
	const [tasks, setTasks]: StateTuple<{ [key: string]: string }> = useState<{ [key: string]: string }>({});
	const [tasksMenuOpen, setTasksMenuOpen]: StateTuple<boolean> = useState(false)

	useEffect((): (() => void) => {
		if (version === undefined)
			bottomBarManager.dbVersion.then((version: string): void => setVersion(version));

		bottomBarManager.on("tasksUpdated", setTasks);

		return (): void => {
			bottomBarManager.off("tasksUpdated", setTasks);
		};
	}, [version]);

	const hasVersion: boolean = version !== undefined;
	const hasTasks: boolean = Object.keys(tasks).length !== 0;

	return (
		<footer className="footer-container">
			<div className="footer-version">
				<FontAwesomeIcon
					className={hasVersion ? "" : "fa-spin"}
					icon={hasVersion ? faDatabase : faSpinner}
					display="block"
				/>
				<p>{version ?? "loading..."}</p>
			</div>
			{
				hasTasks ? (
					<div className="footer-tasks-container">
						<ProgressBar mode="indeterminate" style={{ height: '3px', width: '5vw' }} />
						<FontAwesomeIcon onClick={(): void => setTasksMenuOpen(!tasksMenuOpen)} icon={tasksMenuOpen ? faCaretUp : faCaretRight} />
						<p>Running {Object.keys(tasks).length} tasks</p>
					</div>
				) : (
					<div className="footer-tasks-container">
						<FontAwesomeIcon icon={faCircleCheck} display="block"/>
						<p>Ready.</p>
					</div>
				)
			}
		</footer>
	);
}