import {MutableRefObject, ReactElement, useEffect, useState} from "react";

import useTabView, {Tab, TabView} from "@/components/global/TabView";
import {Packets, StateTuple} from "@/types/TypeDefinitions";

import {DateTime} from "luxon";

interface ResultsViewerProps {
	results: MutableRefObject<DatabaseResult[]>;
}

export interface DatabaseResult {
	time: DateTime;
	content: string | Packets[];
}

export default function ResultsViewer({results}: ResultsViewerProps): ReactElement {
	const [TabComponent, currentTab, tabs, setCurrentTab]: TabView<DatabaseResult> = useTabView<DatabaseResult>(0, onChangeTab);
	const [ready, setReady]: StateTuple<boolean> = useState<boolean>(false);

	useEffect((): void => {
		if (!ready) {
			tabs.current = results.current.map((result: DatabaseResult): Tab<DatabaseResult> => ({
				name: `${typeof result.content === "string" ? "Error" : "Result"} ${result.time.toFormat("LL/dd - HH:mm:ss")}`,
				isRenaming: false,
				args: result
			}));
			setReady(true);
		}
	}, [ready, results, tabs]);

	function onChangeTab(): void {
		results.current = tabs.current.map(({args}: Tab<DatabaseResult>): DatabaseResult => args);
	}

	return (<div className="base-container-style main-console">
		{TabComponent}
	</div>);
}