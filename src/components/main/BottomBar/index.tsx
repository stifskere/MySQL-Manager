import {ReactElement, useEffect, useState} from "react";
import {StateTuple} from "@/types/TypeDefinitions";

import bottomBarManager, {Task} from "@/managers/BottomBarManager";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretRight, faCaretUp, faCircleCheck, faDatabase, faSpinner} from "@fortawesome/free-solid-svg-icons";

import {ProgressBar} from "primereact/progressbar";

import "./index.css";
import {DateTime} from "luxon";


export default function BottomBar(): ReactElement {
	const [version, setVersion]: StateTuple<string | undefined> = useState<string | undefined>(undefined);
	const [tasks, setTasks]: StateTuple<{ [key: string]: Task }> = useState<{ [key: string]: Task }>({});
	const [tasksMenuOpen, setTasksMenuOpen]: StateTuple<boolean> = useState(false)

	useEffect((): (() => void) => {
		if (version === undefined)
			bottomBarManager.dbVersion.then((version: string): void => setVersion(version));

		bottomBarManager.on("tasksUpdated", setTasks);

		const interval: NodeJS.Timeout = setInterval((): void => {
			for (const task in tasks) {
				const element: HTMLParagraphElement | null
					= document.getElementById(`task-${task}-counter`) as HTMLParagraphElement | null;

				if (element === null)
					continue;

				element.innerText = "running for: " + DateTime.now()
					.diff(tasks[task].since)
					.toFormat("hh'h':mm'm':ss's'")
					.replace(/0{1,2}[mh]:?/g, "")
			}
		}, 1000);

		return (): void => {
			bottomBarManager.off("tasksUpdated", setTasks);
			clearInterval(interval);
		};
	}, [tasks, version]);

	const hasVersion: boolean = version !== undefined;
	const hasTasks: boolean = Object.keys(tasks).length !== 0;
	const tasksNo: number = Object.keys(tasks).length;

	if (!hasTasks && tasksMenuOpen)
		setTasksMenuOpen(false);

	function openTaskMenu(): void {
		setTasksMenuOpen(!tasksMenuOpen)
	}

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
					<div className="footer-tasks-container" onClick={openTaskMenu}>
						{
							tasksMenuOpen &&
							(<div className="footer-tasks-viewer base-container-style">
								{Object.keys(tasks).map((key: string): ReactElement => (
									<div key={key} className="footer-tasks-task">
										<p><FontAwesomeIcon icon={faSpinner} className="fa-spin footer-tasks-task-spinner"/> {tasks[key].name}</p>
										<small id={`task-${key}-counter`}>running for: 0s</small>
									</div>
								))}
							</div>)
						}
						<ProgressBar mode="indeterminate" style={{ height: '3px', width: '5vw' }} />
						<FontAwesomeIcon icon={tasksMenuOpen ? faCaretUp : faCaretRight} />
						<p>Running {tasksNo} {tasksNo === 1 ? "task" : "tasks"}</p>
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