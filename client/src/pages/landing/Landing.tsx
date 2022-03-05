import React from "react";
import { Link } from "react-router-dom";
import "./Landing.css";

export default function Landing() {
	return (
		<div id="main">
			{/* MUI will replace some of this */}
			<h1>The Cook Book</h1>
			<div id="subsplash">Make the Extraordinary</div>
			<button id="find">
				<Link to="/example" class="links">
					Find Your Recipe
				</Link>
			</button>
			<h4>(c) 2022 yess this group</h4>
			<div id="topright">
				<button id="signin">
					<Link to="/example" class="links">
						Sign In
					</Link>
				</button>
			</div>
		</div>
	);
}
