import {ReactElement, useEffect, useState} from "react";
import {StateTuple} from "@/types/TypeDefinitions";
import {BaseResponse} from "@/types/api-responses/BaseResponse";

import {Tree} from "primereact/tree";
import {TreeNode} from "primereact/treenode";

import {Column, Connection, Database, TableLike} from "@/types/api-responses/ConnectionData";

import BottomBarManager from "@/managers/BottomBarManager";

import "./index.css";

// TODO: style and maybe change tree semantics

export default function DatabaseNavigator(): ReactElement {
	const [nodes, setNodes]: StateTuple<TreeNode[]> = useState<TreeNode[]>([]);
	const [ready, setReady]: StateTuple<boolean> = useState<boolean>(false);

	useEffect((): void => {
		if (ready)
			return;

		BottomBarManager.addTask("db-map", "introspecting connections");

		fetch("/api/connections", { method: "GET" })
			.then((response: Response): Promise<BaseResponse<{ [name: string]: Connection } | string>> => response.json())
			.then((connections: BaseResponse<{ [name: string]: Connection } | string>): void => {
				if (typeof connections.message === "string")
					return;

				setNodes(Object.entries(connections.message! satisfies { [name: string]: Connection }).map(([name, connection]: [string, Connection]): TreeNode => ({
					label: name,
					key: name,
					children: [{
						label: "Databases",
						key: `${name}-databases`,
						children: Object.entries(connection.databases ?? {}).map(([name, database]: [string, Database]): TreeNode => ({
							label: name,
							key: name,
							children: [{
								label: "Tables",
								key: `${name}-tables`,
								children: Object.entries(database.tables).map(([name, table]: [string, TableLike]): TreeNode => ({
									label: name,
									key: name,
									children: Object.entries(table.columns).map(([name, column]: [string, Column]): TreeNode => ({
										label: name
									}))
								}))
							}]
						}))
					}]
				})));
			})
			.then((): void => {
				BottomBarManager.removeTask("db-map");
			});

		setReady(true);
	}, [ready, nodes]);

	return (
		<div className="base-container-style connection-explorer-main">
			<Tree className="connection-explorer-tree" value={nodes}></Tree>
		</div>
	);
}