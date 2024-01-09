import {HTMLInputTypeAttribute, ReactElement} from "react";

import {InputText} from "primereact/inputtext";

interface ModalInputProps {
	text: string;
	help?: string;
	placeholder?: string;
	type?: HTMLInputTypeAttribute;
	required?: boolean;
}

import "./index.css";

export default function ModalInput({text, help, placeholder, type = "text", required}: ModalInputProps): ReactElement {
	return (
		<div className="modal-input">
			<label htmlFor="username">{text}</label>
			<InputText required={required ?? false} id="username" aria-describedby="username-help" placeholder={placeholder} type={type} />
			{help &&
				<small id="username-help">
					{help}
				</small>
			}
		</div>
	);
}