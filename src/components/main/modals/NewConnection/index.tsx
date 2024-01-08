import {ReactElement, useContext} from "react";

import Shown from "@/types/props/Shown";

import ModalInput from "@/components/main/modals/ModalInput";

import "./index.css";

export default function NewConnectionModal({shown}: Shown): ReactElement {

	return shown ? (
		<div className="modal-background">
			<div className="modal-tt-container">
				<h1>New connection</h1>
				<div className="base-container-style new-connection-container">
					<ModalInput text="Connection name" help="How you want to name this connection handler, doesn't change the connection behavior"/>
				</div>
			</div>
		</div>
	) : (
		<></>
	);
}