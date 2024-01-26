import {MutableRefObject, ReactElement, useEffect, useRef, useState} from "react";
import {StateTuple} from "@/types/TypeDefinitions";

import FileBar from "./FileBar";

import { Editor } from "@monaco-editor/react";

import "./index.css";

interface SqlEditorProps {
	onChangeSql: ((sql: string) => void);
}

export default function SqlEditor({onChangeSql}: SqlEditorProps): ReactElement {
	const [content, setContent]: StateTuple<string> = useState<string>("");
	const saveFunction: MutableRefObject<((content: string) => void)> = useRef<(content: string) => void>((): void => {});

	useEffect((): void => {
		onChangeSql(content);
	}, [content, onChangeSql]);

	function onChangeFile(content: string, saveCurrent: ((content: string) => void)): void {
		setContent(content);
		saveFunction.current = saveCurrent;
	}

	function onChangeText(value?: string): void {
		if (value !== undefined) {
			saveFunction.current(value);
			onChangeSql(value);
		}
	}

	return (
		<div className="base-container-style sql-editor-container">
			<FileBar onChange={onChangeFile}/>
			<Editor
				width="100%"
				defaultLanguage="sql"
				theme="vs-dark"
				value={content}
				onChange={onChangeText}
			/>
		</div>
	);
}