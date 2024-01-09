import EventEmitter from "events";

class BottomBarManager extends EventEmitter {
	public changeBottomText(text: string): void {
		this.emit("textChanged", text);
	}

	public get dbVersion(): Promise<string> {
		return fetch("/api/data?query=driver_version")
			.then((result: Response): Promise<string> => result.text());
	}
}

const bottomBarManager: BottomBarManager = new BottomBarManager();

export default bottomBarManager;