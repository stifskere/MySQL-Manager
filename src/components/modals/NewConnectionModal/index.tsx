import {
	FormEvent,
	KeyboardEvent,
	ReactElement,
	useState
} from "react";
import { StateTuple } from "@/types/TypeDefinitions";

import ModalProps from "@/types/props/ModalProps";
import ModalInput from "@/components/modals/ModalInput";

import { Button } from "primereact/button";

import { FaCircleExclamation } from "react-icons/fa6";

import "./index.css";

export default function NewConnectionModal({onCancel}: ModalProps): ReactElement {
	const [statusText, setStatusText]: StateTuple<string | undefined> = useState<string | undefined>()

	function connect(event: FormEvent): void {
		event.preventDefault();

		if (!(event.target as HTMLFormElement).checkValidity()) {
			return;
		}

		const inputElements: HTMLCollectionOf<HTMLInputElement>
			= event.currentTarget.getElementsByTagName("input");

		const body: { [key: string]: string } = {};

		for (const element of inputElements) {
			body[element.name] = element.value;
		}

		fetch("/api/connections", { method: "post", body: JSON.stringify(body) })
			.then(async (response: Response): Promise<void> => {
				if (response.ok)
					location.reload();
				else
					setStatusText((await response.json()).message);
			});

	}

	function onKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
		if (event.code === "Enter") {
			event.preventDefault();
			(document.getElementById("new-connection-form") as HTMLFormElement).submit();
		}
	}

	return (
		<div className="modal-background">
			<div className="modal-tt-container">
				<h1>New connection</h1>
				<form onSubmit={connect} id="new-connection-form">
					<div className="base-container-style new-connection-container">
						<ModalInput onKeyDown={onKeyDown} name="connection_name" required text="Connection name" help="Connection handler name, doesn't interfer with MySQL settings."/>
						<div className="new-connection-vertical-fields">
							<ModalInput onKeyDown={onKeyDown} name="host" required text="Host" placeholder="0.0.0.0"/>
							<ModalInput onKeyDown={onKeyDown} name="port" type="number" required text="Port" placeholder="3306" default="3306" />
						</div>
						<ModalInput onKeyDown={onKeyDown} name="database" required text="Database" />
						<div className="new-connection-vertical-fields">
							<ModalInput onKeyDown={onKeyDown} name="user" text="User" />
							<ModalInput onKeyDown={onKeyDown} name="password" text="Password" type="password" />
						</div>
						<div className="new-connection-vertical-fields">
							<div className="new-connection-status" style={{visibility: statusText !== undefined ? "visible" : "hidden"}}>
								<FaCircleExclamation />
								<p>{statusText}</p>
							</div>
							<div className="new-connection-action-buttons">
								<Button type="button" onClick={onCancel} label="Cancel" severity="secondary" text raised/>
								<Button label="Connect" severity="success" text raised type="submit"/>
							</div>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}