import {ReactElement} from "react";

import "./index.css";
import {TreeNode} from "primereact/treenode";

interface DatabaseNavigatorProps {
	className?: string;
	node?: TreeNode; // TODO: not optional
}

export default function DatabaseNavigator({className, node}: DatabaseNavigatorProps): ReactElement {
	return (<div className={className}>
		{/*TODO: fill this*/}
	</div>);
}