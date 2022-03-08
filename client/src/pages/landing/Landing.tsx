import React from "react";
import { Link } from "react-router-dom";
import "./Landing.css";

export default function Landing() {
	return (
		<div id="main">
			{/* MUI will replace some of this */}
			<h1>Cook Book</h1>
			<div id="subsplash">Make Food</div>
			<button id="find">
				<Link to="/example" className="links">
					Find Recipes
				</Link>
			</button>
			<h4>(c) 2022 PoopGroup</h4>
			<div id="topright">
				<button id="signin">
					<Link to="/login" className="links">
						Sign In
					</Link>
				</button>
			</div>
		</div>
	);
}
