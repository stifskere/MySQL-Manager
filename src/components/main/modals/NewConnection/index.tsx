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
				<form method="POST" action="/api/connections">
					<div className="base-container-style new-connection-container">
						<ModalInput name="connection_name" required={true} text="Connection name" help="Connection handler name, doesn't interfer with MySQL settings."/>
						<div className="new-connection-vertical-fields">
							<ModalInput name="host" required={true} text="Host" placeholder="0.0.0.0"/>
							<ModalInput name="port" required={true} text="Port" placeholder="3306" default="3306" />
						</div>
						<ModalInput name="database" required={true} text="Database" />
						<div className="new-connection-vertical-fields">
							<ModalInput name="user" text="User" />
							<ModalInput name="password" text="Password" type="password" />
						</div>
						<div className="new-connection-action-buttons">
							<Button onClick={onCancel} label="Cancel" severity="secondary" text raised />
							<Button label="Connect" severity="success" text raised type="submit" />
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}