import React from "react";
import Landing from "../landing/Landing";
import Example from "../example/Example";
import Login from "../login/Login";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

function App() {
	return (
		<BrowserRouter>
			<div style={{ width: "10%", zIndex: "99", position: "absolute" }}>
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
					</ul>
				</nav>
			</div>
			{/* A <Routes> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
			<Routes>
				<Route path="/example" element={<Example />} />
				<Route path="/login" element={<Login />} />
				<Route path="/" element={<Landing />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
