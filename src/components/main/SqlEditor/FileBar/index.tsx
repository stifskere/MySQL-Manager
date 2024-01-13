import {
	FocusEvent,
	KeyboardEvent,
	MutableRefObject,
	ReactElement,
	useCallback,
	useEffect,
	useRef,
	useState
} from "react";
import {StateTuple} from "@/types/TypeDefinitions";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faDownload, faFile, faUpload, faXmark} from "@fortawesome/free-solid-svg-icons";

import "./index.css";

interface FileBarProps {
	onChange: ((content: string, saveCurrent: ((content: string) => void)) => void);
}

interface File {
	name: string;
	content: string;
	isRenaming: boolean;
}

// THIS FILE IS A FUCKING SPAGHETTI

export default function FileBar({onChange}: FileBarProps): ReactElement {
	const [currentFile, setCurrentFile]: StateTuple<number> = useState<number>(0);
	const [forceReKey, setForceReKey]: StateTuple<number> = useState<number>(0); // Don't kill me please :pray:
	const files: MutableRefObject<File[]> = useRef<File[]>([]);

	const saveCurrent: ((content: string) => void) = useCallback((content: string): void => {
		files.current[currentFile].content = content;
		saveInStorage();
	}, [currentFile]);

	useEffect((): void => {
		if (files.current.length === 0) {
			const filesRetrieved: string | null = sessionStorage.getItem("files");

			files.current = filesRetrieved !== null
				? JSON.parse(filesRetrieved) satisfies File[]
				: [
					{
						name: "welcome.sql",
						content: "-- This editor doesn't come with database autocompletion yet, but it will send your queries to any MySQL connection." +
							"\n\n" +
							"SELECT 'Hello World!';",
						isRenaming: false
					}
				];
		}

		onChange(files.current[currentFile].content, saveCurrent)
	}, [currentFile, onChange, saveCurrent]);

	function forceReRender(): void {
		setForceReKey(forceReKey > 1000 ? 0 : forceReKey + 1);
	}

	function clearEdits(): void {
		for (const file in files.current)
			files.current[file].isRenaming = false;
	}

	function changeFile(index: number): (() => void) {
		return (): void => {
			setCurrentFile(index);
		};
	}

	function saveInStorage(): void {
		sessionStorage.setItem("files", JSON.stringify(files.current));
	}

	function closeFile(index: number): (() => void) {
		return (): void => {
			files.current.splice(index, 1);
			const nextFile: number = index - 1 < 0 ? index : index - 1;

			if (nextFile === currentFile)
				forceReRender();

			setCurrentFile(nextFile);

			onChange(files.current[nextFile].content, saveCurrent)
		}
	}

	function onDownload(): void {
		const downloadElement: HTMLAnchorElement = document.createElement("a");
		downloadElement.href = URL.createObjectURL(new Blob([files.current[currentFile].content], {type: 'text/plain'}));
		downloadElement.download = "script.sql";
		document.body.appendChild(downloadElement);
		downloadElement.click();
		document.body.removeChild(downloadElement);
	}

	function onUpload(): void {
		const uploadElement: HTMLInputElement = document.createElement("input");

		async function handleFileChange(): Promise<void> {
			files.current.push({
				name: uploadElement.files![0].name,
				content: await uploadElement.files![0].text(),
				isRenaming: false
			});

			forceReRender();
		}

		uploadElement.style.display = "none";
		uploadElement.type = "file";
		uploadElement.accept = ".sql";
		uploadElement.onchange = handleFileChange;
		document.body.appendChild(uploadElement);
		uploadElement.click();
	}

	function onNewFile(): void {
		clearEdits();

		files.current.push({
			name: "file.sql",
			content: "",
			isRenaming: true
		});

		forceReRender();
	}

	function renameFile(index: number): (() => void) {
		return (): void => {
			clearEdits();

			files.current[index].isRenaming = true;

			forceReRender();
		};
	}

	function onSubmitRename(index: number): ((event: KeyboardEvent<HTMLInputElement>) => void) {
		return (event: KeyboardEvent<HTMLInputElement>): void => {
			if (event.code !== "Enter")
				return;

			files.current[index].isRenaming = false;
			files.current[index].name = (event.target as HTMLInputElement).value;

			saveInStorage();
			forceReRender();
		};
	}

	function onBlurRename(index: number): ((event: FocusEvent<HTMLInputElement>) => void) {
		return (event: FocusEvent<HTMLInputElement>): void => {
			files.current[index].isRenaming = false;
			files.current[index].name = (event.target as HTMLInputElement).value;

			saveInStorage();
			forceReRender();
		};
	}

	const moreThanOneFile: boolean = files.current.length > 1;

	return (
		<div className="file-bar-controls">
			<div className="file-bar-controls-buttons">
				<div className="file-bar-control-icon" onClick={onUpload}><FontAwesomeIcon icon={faUpload}/></div>
				<div className="file-bar-control-icon" onClick={onDownload}><FontAwesomeIcon icon={faDownload}/></div>
				<div className="file-bar-control-icon" onClick={onNewFile}><FontAwesomeIcon icon={faFile}/></div>
			</div>
			<div className="file-bar-main">
				{files.current.map(({name, isRenaming}: File, key: number): ReactElement => (
					<div onAuxClick={moreThanOneFile ? closeFile(key) : undefined} key={key} className={`file-bar-file ${currentFile === key && "file-bar-file-current"}`}>
						{isRenaming
							? <input onBlur={onBlurRename(key)} onKeyDown={onSubmitRename(key)} autoFocus className="file-bar-edit-input" defaultValue={name}/>
							: <p onClick={changeFile(key)} onDoubleClick={renameFile(key)} >{name}</p>}
						{moreThanOneFile && <FontAwesomeIcon icon={faXmark} size="sm" className="file-bar-file-close" onClick={closeFile(key)}/>}
					</div>
				))}
			</div>
		</div>
	);
}