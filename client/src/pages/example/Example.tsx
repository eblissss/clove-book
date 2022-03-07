import React from "react";
import logo from "../../logo.svg";
import { Counter } from "../../components/counter/Counter";
import "./Example.css";

function Example() {
	return (
		<div className="Example">
			<header className="Example-header">
				<img src={logo} className="Example-logo" alt="logo" />
				<Counter />
				<iframe
					title="vid"
					id="ytplayer"
					width="1000"
					height="180"
					src="https://www.youtube.com/embed/dNl4-w9ZrBs?autoplay=1"
				></iframe>
				<span>
					<span>Learn </span>
					<a
						className="Example-link"
						href="https://reactjs.org/"
						target="_blank"
						rel="noopener noreferrer"
					>
						React
					</a>
					<span>, </span>
					<a
						className="Example-link"
						href="https://redux.js.org/"
						target="_blank"
						rel="noopener noreferrer"
					>
						Redux
					</a>
					<span>, </span>
					<a
						className="Example-link"
						href="https://redux-toolkit.js.org/"
						target="_blank"
						rel="noopener noreferrer"
					>
						Redux Toolkit
					</a>
					,<span> and </span>
					<a
						className="Example-link"
						href="https://react-redux.js.org/"
						target="_blank"
						rel="noopener noreferrer"
					>
						React Redux
					</a>
				</span>
			</header>
		</div>
	);
}

export default Example;
