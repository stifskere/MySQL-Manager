import {ReactElement, useEffect, useState} from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faFile, faUpload } from "@fortawesome/free-solid-svg-icons";

import { Editor } from "@monaco-editor/react";

import "./index.css";
import {StateTuple} from "@/types/TypeDefinitions";

export default function SqlEditor(): ReactElement {
	const [editorValue, setEditorValue]: StateTuple<string> = useState<string>(
		"-- This editor doesn't come with database autocompletion yet, but it will send your queries to any MySQL connection." +
		"\n\n" +
		"SELECT 'Hello World!';"
	);

	const [loaded, setLoaded] = useState<boolean>(false);

	useEffect((): void => {
		if (!loaded) {
			const storedValue: string | null = sessionStorage.getItem("editor-text");

			if (storedValue !== null)
				setEditorValue(storedValue);

			setLoaded(true);
		}

		if (loaded)
			sessionStorage.setItem("editor-text", editorValue);
	}, [editorValue, loaded]);

	function onDownload(): void {
		if (editorValue === null)
			return;

		const downloadElement: HTMLAnchorElement = document.createElement("a");
		downloadElement.href = URL.createObjectURL(new Blob([editorValue], {type: 'text/plain'}));
		downloadElement.download = "script.sql";
		document.body.appendChild(downloadElement);
		downloadElement.click();
		document.body.removeChild(downloadElement);
	}

	function onUpload(): void {
		const uploadElement: HTMLInputElement = document.createElement("input");

		function handleFileChange(e: Event): void {
			((e.target as any).files[0] as File).text().then((t: string): void => {
				setEditorValue(t);
			});

			document.body.removeChild(uploadElement);
		}

		uploadElement.style.display = "none";
		uploadElement.type = "file";
		uploadElement.onchange = handleFileChange;
		document.body.appendChild(uploadElement);
		uploadElement.click();
	}

	function onClear(): void {
		setEditorValue("");
	}

	function onChange(text?: string): void {
		if (text !== undefined)
			setEditorValue(text);
	}

	return (
		<div className="base-container-style sql-editor-container">
			<div className="sql-editor-controls">
				<div className="sql-editor-control-icon" onClick={onUpload}><FontAwesomeIcon icon={faUpload}/></div>
				<div className="sql-editor-control-icon" onClick={onDownload}><FontAwesomeIcon icon={faDownload}/></div>
				<div className="sql-editor-control-icon" onClick={onClear}><FontAwesomeIcon icon={faFile}/></div>
			</div>
			<Editor
				width="100%"
				defaultLanguage="sql"
				theme="vs-dark"
				value={editorValue!}
				onChange={onChange}
			/>
		</div>
	);
}