import {ReactElement, useState} from "react";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDownload, faFile, faUpload} from "@fortawesome/free-solid-svg-icons";

import {Editor} from "@monaco-editor/react";

import "./index.css";

export default function SqlEditor(): ReactElement {
	const [editorValue, setEditorValue] = useState<string>(
		"-- This editor doesn't come with database autocompletion yet, but it will send your queries to any MySQL connection." +
		"\n\n" +
		"SELECT 'Hello World!';"
	);

	function onDownload(): void {
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

	// TODO: on navigate save content

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
				value={editorValue}
				onChange={(t: string | undefined) => {
					if (t !== undefined)
						setEditorValue(t);
				}}
			/>
		</div>
	);
}