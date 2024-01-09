import {HTMLInputTypeAttribute, ReactElement} from "react";

import {InputText} from "primereact/inputtext";

import "./index.css";

interface ModalInputProps {
	text: string;
	help?: string;
	placeholder?: string;
	type?: HTMLInputTypeAttribute;
	required?: boolean;
	name?: string;
	default?: string;
	className?: string;
}

export default function ModalInput(props: ModalInputProps): ReactElement {
	return (
		<div className="modal-input">
			<label htmlFor="username">{props.text}</label>
			<InputText
				defaultValue={props.default ?? ""}
				name={props.name ?? ""}
				required={props.required ?? false}
				id="username"
				aria-describedby="username-help"
				placeholder={props.placeholder}
				type={props.type}
				className={props.className ?? ""}
			/>
			{props.help &&
				<small id="username-help">
					{props.help}
				</small>
			}
		</div>
	);
}