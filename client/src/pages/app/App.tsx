import React, { useEffect, useMemo, useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

import Landing from "../landing/Landing";
import Example from "../example/Example";
import Login from "../login/Login";
import Home from "../home/Home";
import Saved from "../saved/Saved";
import Create from "../create/Create";
import User from "../user/User";
import Reset from "../reset/Reset";
import Album from "../album/Album";

import ErrorPopup from "../../components/errorPopup/ErrorPopup";
import { useAppDispatch } from "../../app/hooks";
import { setUserID } from "../user/userSlice";
import { setInitialFavorites } from "../../components/userFavs/favSlice";
import { doRefresh, getFavoriteIDs } from "../../api/requests";
import { CssBaseline, PaletteMode, ThemeProvider } from "@mui/material";
import getTheme from "../../theme";
import ColorToggle from "../../components/colorToggle/ColorToggle";

function App() {
	const [mode, setMode] = useState<PaletteMode>("light");
	const colorMode = useMemo(
		() => ({
			toggleColorMode: () => {
				setMode((prevMode: PaletteMode) =>
					prevMode === "light" ? "dark" : "light"
				);
			},
		}),
		[]
	);

	const theme: any = useMemo(() => getTheme(mode), [mode]);

	return (
		<ThemeProvider theme={theme}>
			{/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
			<CssBaseline />
			<BrowserRouter>
				<LoggedIn />
				<ErrorPopup />
				<ColorToggle mode={mode} toggle={colorMode.toggleColorMode} />
				{/* A <Routes> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
				<Routes>
					<Route path="/example" element={<Example />} />
					<Route path="/login" element={<Login />} />
					<Route path="/home" element={<Home />} />
					<Route path="/saved" element={<Saved />} />
					<Route path="/album" element={<Album />} />
					<Route path="/create" element={<Create />} />
					<Route path="/user" element={<User />} />
					<Route path="/reset" element={<Reset />} />
					<Route path="/" element={<Landing />} />
				</Routes>
			</BrowserRouter>
		</ThemeProvider>
	);
}

// This keeps us logged in after refreshing or whatever
function LoggedIn() {
	const dispatch = useAppDispatch();
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
		setInterval(newRefresh, 30 * 60 * 1000);
	}, []);

	return <></>;
}

const newRefresh = () => {
	const refresh = localStorage.getItem("refresh");
	if (refresh !== null) {
		doRefresh(refresh);
		console.log("refreshed!");
	}
};

export default App;
