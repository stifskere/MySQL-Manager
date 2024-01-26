import { InputHTMLAttributes, ReactElement } from "react";

import { InputText } from "primereact/inputtext";

import "./index.css";

interface ModalInputProps extends InputHTMLAttributes<HTMLInputElement> {
	text: string;
	help?: string;
	default?: string;
}

export default function ModalInput(props: ModalInputProps): ReactElement {
	return (
		<div className="modal-input">
			<label htmlFor="modal-input">{props.text}</label>
			<InputText
				name={props.name ?? "aaa"}
				required={props.required ?? false}
				defaultValue={props.default}
				id="modal-input"
				placeholder={props.placeholder}
				type={props.type}
				className={props.className ?? ""}
				readOnly={false}
			/>
			{props.help &&
				<small id="username-help">
					{props.help}
				</small>
			}
		</div>
	);
}