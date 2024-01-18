import {ReactElement, useEffect, useState} from "react";
import {StateTuple} from "@/types/TypeDefinitions";

import bottomBarManager, {Task} from "@/managers/BottomBarManager";

import {FaCaretRight, FaCaretUp, FaCircleCheck, FaDatabase, FaSpinner} from "react-icons/fa6";

import {ProgressBar} from "primereact/progressbar";
import {DateTime} from "luxon";

import "./index.css";


export default function BottomBar(): ReactElement {
	const [version, setVersion]: StateTuple<string | undefined> = useState<string | undefined>(undefined);
	const [tasks, setTasks]: StateTuple<{ [key: string]: Task }> = useState<{ [key: string]: Task }>({});
	const [tasksMenuOpen, setTasksMenuOpen]: StateTuple<boolean> = useState(false)

	useEffect((): (() => void) => {
		if (version === undefined)
			bottomBarManager.dbVersion.then((version: string): void => setVersion(version));

		bottomBarManager.once("tasksUpdated", setTasks);

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
			clearInterval(interval);
		};
	}, [tasks, version]);

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
				{version !== undefined
					? <FaDatabase display="block" />
					: <FaSpinner className="fa-spin" display="block" />
				}

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
										<p><FaSpinner className="fa-spin footer-tasks-task-spinner"/> {tasks[key].name}</p>
										<small id={`task-${key}-counter`}>running for: 0s</small>
									</div>
								))}
							</div>)
						}
						<ProgressBar mode="indeterminate" style={{ height: '3px', width: '5vw' }} />
						{tasksMenuOpen ? <FaCaretUp/> : <FaCaretRight/>}
						<p>{tasksNo === 1 ? tasks[Object.keys(tasks)[0]].name : `Running ${tasksNo} tasks`}</p>
					</div>
				) : (
					<div className="footer-tasks-container">
						<FaCircleCheck display="block"/>
						<p>Ready.</p>
					</div>
				)
			}
		</footer>
	);
}