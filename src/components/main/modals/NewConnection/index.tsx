import { FormEvent, KeyboardEvent, ReactElement, useState } from "react";
import { StateTuple } from "@/types/TypeDefinitions";

import ModalProps from "@/types/props/ModalProps";
import ModalInput from "@/components/main/modals/ModalInput";

import { Button } from "primereact/button";

import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./index.css";

export default function NewConnectionModal({onCancel}: ModalProps): ReactElement {
	const [statusText, setStatusText]: StateTuple<string | undefined> = useState<string | undefined>()

	function connect(event: FormEvent): void {
		event.preventDefault();

		const inputElements: HTMLCollectionOf<HTMLInputElement>
			= event.currentTarget.getElementsByTagName("input");

		const body: { [key: string]: string } = {};

		for (const element of inputElements) {
			body[element.name] = element.value;
		}

		console.log(JSON.stringify(body))

		fetch("/api/connections", { method: "post", body: JSON.stringify(body) })
			.then(async (response: Response): Promise<void> => {
				if (response.ok)
					location.reload();
				else
					setStatusText((await response.json()).message);
			});

	}

	function onKeyDown(event: KeyboardEvent<HTMLFormElement>): void {
		if (event.code === "Enter") {
			event.preventDefault();
			event.currentTarget.submit();
		}
	}

	return (
		<div className="modal-background">
			<div className="modal-tt-container">
				<h1>New connection</h1>
				<form onSubmit={connect} onKeyDown={onKeyDown}>
					<div className="base-container-style new-connection-container">
						<ModalInput name="connection_name" required={true} text="Connection name" help="Connection handler name, doesn't interfer with MySQL settings."/>
						<div className="new-connection-vertical-fields">
							<ModalInput name="host" required={true} text="Host" placeholder="0.0.0.0"/>
							<ModalInput name="port" type="number" required={true} text="Port" placeholder="3306" default="3306" />
						</div>
						<ModalInput name="database" required={true} text="Database" />
						<div className="new-connection-vertical-fields">
							<ModalInput name="user" text="User" />
							<ModalInput name="password" text="Password" type="password" />
						</div>
						<div className="new-connection-vertical-fields">
							<div className="new-connection-status" style={{visibility: statusText !== undefined ? "visible" : "hidden"}}>
								<FontAwesomeIcon icon={faCircleExclamation} />
								<p>{statusText}</p>
							</div>
							<div className="new-connection-action-buttons">
								<Button onClick={onCancel} label="Cancel" severity="secondary" text raised/>
								<Button label="Connect" severity="success" text raised type="submit"/>
							</div>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}