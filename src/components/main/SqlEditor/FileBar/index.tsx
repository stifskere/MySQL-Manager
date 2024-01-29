import {ReactElement, useCallback, useEffect, useState} from "react";
import {StateTuple} from "@/types/TypeDefinitions";

import { FaDownload, FaFile, FaUpload } from "react-icons/fa6";

import bottomBarManager from "@/managers/BottomBarManager";
import useTabView, {type Tab, type TabView} from "@/components/global/TabView";

import "./index.css";
import useTriggerReRender from "@/components/global/TriggerReRender";

interface FileBarProps {
	onChange: ((content: string, saveCurrent: ((content: string) => void)) => void);
}

interface File {
	content: string;
}

export default function FileBar({onChange}: FileBarProps): ReactElement {
	const [ready, setReady]: StateTuple<boolean> = useState<boolean>(false);
	const triggerReRender: (() => void) = useTriggerReRender();
	const [TabComponent, currentTab, tabs, setCurrent]: TabView<File> = useTabView<File>(1, (): void => {
		saveInStorage();
	});

	const saveInStorage = useCallback((): void => {
		sessionStorage.setItem("files", JSON.stringify(tabs.current));
	}, [tabs]);

	const saveCurrent: ((content: string) => void) = useCallback((content: string): void => {
		tabs.current[currentTab].args.content = content;
		saveInStorage();
	}, [currentTab, saveInStorage, tabs]);

	useEffect((): void => {
		if (!ready) {
			const filesRetrieved: string | null = sessionStorage.getItem("files");

			tabs.current = (filesRetrieved !== null
				? JSON.parse(filesRetrieved)
				: [
					{
						name: "welcome.sql",
						isRenaming: false,
						args: {
							content: "-- This editor doesn't come with database autocompletion yet, but it will send your queries to any MySQL connection." +
								"\n\n" +
								"SELECT 'Hello World!';",
						}
					}
				]) satisfies Tab<File>[];

			setReady(true);
			setCurrent(0);
		} else {
			onChange(tabs.current[currentTab].args.content, saveCurrent);
		}
	}, [currentTab, onChange, ready, saveCurrent, setCurrent, tabs]);

	function onDownload(): void {
		bottomBarManager.addTask("dw-file", "Downloading file");
		const downloadElement: HTMLAnchorElement = document.createElement("a");
		downloadElement.href = URL.createObjectURL(new Blob([tabs.current[currentTab].args.content], {type: 'text/plain'}));
		downloadElement.download = tabs.current[currentTab].name;
		document.body.appendChild(downloadElement);
		downloadElement.click();
		document.body.removeChild(downloadElement);
		bottomBarManager.removeTask("dw-file");
	}

	function onUpload(): void {
		const uploadElement: HTMLInputElement = document.createElement("input");

		async function handleFileChange(): Promise<void> {
			tabs.current.push({
				name: uploadElement.files![0].name,
				isRenaming: false,
				args: {
					content: await uploadElement.files![0].text()
				}
			});

			triggerReRender();
			saveInStorage();
		}

		uploadElement.style.display = "none";
		uploadElement.type = "file";
		uploadElement.accept = ".sql";
		uploadElement.onchange = handleFileChange;
		document.body.appendChild(uploadElement);
		uploadElement.click();
	}

	function onNewFile(): void {
		tabs.current.push({
			name: "file.sql",
			isRenaming: true,
			args: {
				content: ""
			}
		});

		setCurrent(tabs.current.length - 1);
		onChange(tabs.current[tabs.current.length - 1].args.content, saveCurrent);
	}

	return (
		<div className="file-bar-controls">
			<div className="file-bar-controls-buttons">
				<div className="file-bar-control-icon" onClick={onUpload}><FaUpload/></div>
				<div className="file-bar-control-icon" onClick={onDownload}><FaDownload/></div>
				<div className="file-bar-control-icon" onClick={onNewFile}><FaFile/></div>
			</div>
			{TabComponent}
		</div>
	);
}