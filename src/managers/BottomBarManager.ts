import EventEmitter from "events";

class BottomBarManager extends EventEmitter {
	private tasks: { [key: string]: string } = {};

	public addTask(key: string, task: string): void {
		if (key in this.tasks)
			return;

		this.tasks[key] = task;

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