import EventEmitter from "events";

export interface Task {
	name: string;
	since: Date;
}

class BottomBarManager extends EventEmitter {
	private tasks: { [key: string]: Task } = {};

	public addTask(key: string, task: string): void {
		if (key in this.tasks)
			return;

		this.tasks[key] = { name: task, since: new Date() };

		this.emit("tasksUpdated", this.tasks);
	}

	public removeTask(key: string): void {
		delete this.tasks[key];

		this.emit("tasksUpdated", this.tasks)
	}

	public get dbVersion(): Promise<string> {
		return fetch("/api/data?query=driver_version")
			.then((result: Response): Promise<string> => result.text());
	}
}

const bottomBarManager: BottomBarManager = new BottomBarManager();

export default bottomBarManager;