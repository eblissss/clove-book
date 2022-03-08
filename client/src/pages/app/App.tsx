import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Landing from "../landing/Landing";
import Example from "../example/Example";
import Login from "../login/Login";
import Home from "../home/Home";
import Saved from "../saved/Saved";
import Plan from "../plan/Plan";
import Create from "../create/Create";

function App() {
	return (
		<BrowserRouter>
			<div
				style={{
					width: "10%",
					zIndex: "99",
					position: "absolute",
					visibility: "hidden",
				}}
			>
				<nav>
					<ul>
						Test Navbar
						<li>
							<Link to="/">Home</Link>
						</li>
						<li>
							<Link to="/example">Example</Link>
						</li>
						<li>
							<Link to="/login">Login</Link>
						</li>
						<li>
							<Link to="/home">Home</Link>
						</li>
						<li>
							<Link to="/saved">Saved</Link>
						</li>
						<li>
							<Link to="/plan">Plan</Link>
						</li>
						<li>
							<Link to="/create">Create</Link>
						</li>
					</ul>
				</nav>
			</div>
			{/* A <Routes> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
			<Routes>
				<Route path="/example" element={<Example />} />
				<Route path="/login" element={<Login />} />
				<Route path="/home" element={<Home />} />
				<Route path="/saved" element={<Saved />} />
				<Route path="/plan" element={<Plan />} />
				<Route path="/create" element={<Create />} />
				<Route path="/" element={<Landing />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
