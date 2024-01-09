import {ReactElement, useEffect, useState} from "react";
import {StateTuple} from "@/types/TypeDefinitions";

import bottomBarManager from "@/components/main/BottomBar/BottomBarManager";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDatabase, faSpinner} from "@fortawesome/free-solid-svg-icons";

import "./index.css";

export default function BottomBar(): ReactElement {
	const [version, setVersion]: StateTuple<string | undefined> = useState<string | undefined>(undefined);
	const [text, setText]: StateTuple<string> = useState<string>("");

	useEffect((): (() => void) => {
		if (version === undefined)
			bottomBarManager.dbVersion.then((version: string): void => setVersion(JSON.parse(version)));

		bottomBarManager.on("textChanged", setText);
		return (): void => {
			bottomBarManager.off("textChanged", setText);
		};
	}, [version]);

	return (
		<footer className="footer-container">
			<div className="footer-version">
				<FontAwesomeIcon icon={version === undefined ? faSpinner : faDatabase} display={"block"} />
				{version ?? "loading..."}
			</div>
			<p>{text}</p>
		</footer>
	);
}