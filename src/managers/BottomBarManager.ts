import EventEmitter from "events";
import { DateTime } from "luxon";

export interface Task {
	name: string;
	since: DateTime;
}

class BottomBarManager extends EventEmitter {
	private m_tasks: { [key: string]: Task } = {};

	public get tasks(): { [key: string]: Task } {
		return Object.assign({}, this.m_tasks);
	}

	public addTask(key: string, task: string): void {
		if (key in this.m_tasks)
			return;

		this.m_tasks[key] = { name: task, since: DateTime.now() };

		this.emit("tasksUpdated", this.m_tasks);
	}

	public removeTask(key: string): void {
		delete this.m_tasks[key];

		this.emit("tasksUpdated", this.m_tasks);
	}

	public get dbVersion(): Promise<string> {
		return fetch("/api/data?query=driver_version")
			.then((result: Response): Promise<string> => result.text());
	}
}

const bottomBarManager: BottomBarManager = new BottomBarManager();

export default bottomBarManager;