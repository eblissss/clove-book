import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

import Landing from "../landing/Landing";
import Example from "../example/Example";
import Login from "../login/Login";
import Home from "../home/Home";
import Saved from "../saved/Saved";
import Create from "../create/Create";
import User from "../user/User";

import ErrorPopup from "../../components/errorPopup/ErrorPopup";
import { useDispatch } from "react-redux";
import { setUserID } from "../user/userSlice";
import { setInitialFavorites } from "../../components/userFavs/favSlice";
import { getFavoriteIDs } from "../../api/requests";

function App() {
	return (
		<BrowserRouter>
			<LoggedIn />
			<ErrorPopup />
			{/* A <Routes> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
			<Routes>
				<Route path="/example" element={<Example />} />
				<Route path="/login" element={<Login />} />
				<Route path="/home" element={<Home />} />
				<Route path="/saved" element={<Saved />} />
				<Route path="/create" element={<Create />} />
				<Route path="/user" element={<User />} />
				<Route path="/" element={<Landing />} />
			</Routes>
		</BrowserRouter>
	);
}

// This keeps us logged in after refreshing or whatever
function LoggedIn() {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		const curExpiry = localStorage.getItem("expiry");
		const curTime = new Date().getTime() / 1000;
		if (curExpiry !== null && parseInt(curExpiry) > curTime) {
			const userID = localStorage.getItem("userID");
			if (userID !== null) {
				dispatch(setUserID(userID));

				getFavoriteIDs(userID, "").then((data) => {
					console.log(data);
					dispatch(setInitialFavorites({ data, userID }));
				});
			} else {
				navigate("/");
			}
		} else {
			navigate("/");
		}
	}, []);

	return <></>;
}

export default App;
