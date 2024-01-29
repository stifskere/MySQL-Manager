import {ReactElement, useEffect} from "react";

import useTabView, {Tab, TabView} from "@/components/global/TabView";
import {Packets} from "@/types/TypeDefinitions";

import {DateTime} from "luxon";

import "./index.css";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";

interface ResultsViewerProps {
	results: DatabaseResult[];
	setResults: (res: DatabaseResult[]) => void;
}

export interface DatabaseResult {
	time: DateTime;
	content: string | Packets;
	index: number;
}

export default function ResultsViewer({results, setResults}: ResultsViewerProps): ReactElement {
	const [TabComponent, currentTab, tabs, setCurrentTab]: TabView<DatabaseResult> = useTabView<DatabaseResult>(0, onChangeTab);

	useEffect((): void => {
		tabs.current = results.map((result: DatabaseResult): Tab<DatabaseResult> => ({
			name: `${typeof result.content === "string" ? "Error" : "Result"} ${result.index > 0 ? `(${result.index})` : ""} ${result.time.toFormat("LL/dd - HH:mm:ss")}`,
			isRenaming: false,
			args: result
		}));

		if (tabs.current.length > 0 && currentTab === -1)
			setCurrentTab(0);
	}, [currentTab, results, setCurrentTab, tabs]);

	function onChangeTab(): void {
		setResults(tabs.current.map(({args}: Tab<DatabaseResult>): DatabaseResult => args));
	}

	const currentResult: undefined | DatabaseResult = tabs.current[currentTab]?.args;

	return (
		<div className="base-container-style main-console">
			{currentResult !== undefined
				? <>
					<div className="results-viewer-tabs">{TabComponent}</div>
					{Array.isArray(currentResult.content)
						? <div className="success-result-tab">
							<DataTable size="small" showGridlines scrollable value={currentResult.content} tableClassName="results-viewer-table">
								{Object.keys((currentResult.content as { [key: string]: unknown }[])[0]).map((field: string, key: number): ReactElement =>
									(<Column key={key} field={field.toLowerCase()} header={field} bodyStyle={{backgroundColor: "transparent"}}/>))}
							</DataTable>
						</div>
						: <div className="error-result-tab">
							<div>
								<h1 className="error-result-title">This query resulted in an error</h1>
								<div className="error-result-container">
									<p>{(currentResult.content as any).message}</p> {/*desperation*/}
								</div>
							</div>
						</div>
					}
				</>
				: <div className="no-queries-result-tab">
					<h1>No queries yet</h1>
					<p>Run a query on some connection o view the results here.</p>
				</div>
			}
		</div>
	);
}