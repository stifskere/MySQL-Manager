import {ReactElement} from "react";

import ModalProps from "@/types/props/ModalProps";

import {Button} from "primereact/button";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGithub, faReact} from "@fortawesome/free-brands-svg-icons";

import "./index.css";
import {faServer} from "@fortawesome/free-solid-svg-icons";

export default function AboutModal({onCancel}: ModalProps): ReactElement {
	return (
		<div className="modal-background">
			<div className="modal-tt-container">
				<h1>About this</h1>
				<div className="base-container-style about-modal-container">
					<div>
						<h2>What is this?</h2>
						<p>
							This is a simple MySQL IDE where you can simply connect to your
							databases, send queries, view data, export data... all of this in a single place
							and with syntax highlighting.
						</p>
					</div>
					<div>
						<h2>How does this work?</h2>
						<p>
							This stores a session GUID in a server for you, meanwhile you do not clear your session
							storage
							you will have all of your connections and code available for you, when you leave the site,
							all of your connections get cleared after 24H of not sending requests, you can also request
							erasing your data.
						</p>
					</div>
					<div>
						<h2>Why I made this?</h2>
						<p>
							This is a project made for my databases subject in my university, this was made as simple
							as possible in a 1 week timespan.
						</p>
					</div>
					<div className="about-modal-made-with">
						<div>
							<p>Made using</p>
							<a href="https://react.dev/" target="_blank">
								<FontAwesomeIcon icon={faReact} size="3x" />
							</a>
							<small>ReactJS + NextJS</small>
						</div>
						<div>
							<p>Hosted on</p>
							<a href="https://firebase.google.com/" target="_blank">
								<FontAwesomeIcon icon={faServer} size="3x" />
							</a>
							<small>firebase</small>
						</div>
						<div>
							<p>Source code</p>
							<a href="https://github.com/stifskere/MySQL-Manager" target="_blank">
								<FontAwesomeIcon icon={faGithub} size="3x" />
							</a>
							<small>GitHub</small>
						</div>
					</div>
					<div className="about-modal-action-buttons">
						<Button onClick={onCancel} label="Okay" severity="help" text raised/>
					</div>
				</div>
			</div>
		</div>
	);
}