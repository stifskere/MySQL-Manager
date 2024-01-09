import {ReactElement} from "react";

import ModalProps from "@/types/props/ModalProps";
import ModalInput from "@/components/main/modals/ModalInput";

import {Button} from "primereact/button";

import "./index.css";

export default function NewConnectionModal({onCancel}: ModalProps): ReactElement {
	return (
		<div className="modal-background">
			<div className="modal-tt-container">
				<h1>New connection</h1>
				<div className="base-container-style new-connection-container">
					<ModalInput required={true} text="Connection name" help="Connection handler name, doesn't interfer with MySQL settings."/>
					<ModalInput required={true} text="Host" placeholder="0.0.0.0"/>
					<ModalInput required={true} text="Database" />
					<div className="new-connection-user-input">
						<ModalInput text="User" />
						<ModalInput text="Password" type="password" />
					</div>
					<div className="new-connection-action-buttons">
						<Button onClick={onCancel} label="Cancel" severity="secondary" text raised />
						<Button label="Connect" severity="success" text raised />
					</div>
				</div>
			</div>
		</div>
	);
}