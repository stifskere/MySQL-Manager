import {ReactElement} from "react";

import {InputText} from "primereact/inputtext";

interface ModalInputProps {
	text: string;
	help?: string;
}

import "./index.css";

export default function ModalInput({text, help}: ModalInputProps): ReactElement {
	return (
		<div className="modal-input">
			<label htmlFor="username">{text}</label>
			<InputText id="username" aria-describedby="username-help" />
			{help &&
				<small id="username-help">
					{help}
				</small>
			}
		</div>
	);
}