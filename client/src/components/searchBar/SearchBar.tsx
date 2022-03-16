import React from "react";
import { IconButton, InputBase, Paper } from "@mui/material";
import { Menu as MenuIcon, Search as SearchIcon } from "@mui/icons-material";

import { useAppDispatch } from "../../app/hooks";
import { setSearch } from "./searchSlice";

interface searchBarProps {
	paperProps?: any;
}

export default function SearchBar(props: searchBarProps) {
	const dispatch = useAppDispatch();

	function updateSearch() {
		const searchVal = (
			document.getElementById("search") as HTMLInputElement
		).value;

		console.log(searchVal);

		dispatch(setSearch(searchVal));

		return searchVal;
	}

	return (
		<Paper
			component="div"
			sx={{
				p: "2px 4px",
				display: "flex",
				alignItems: "center",
				backgroundColor: "primary.dark",
				...props.paperProps,
			}}
		>
			<IconButton sx={{ p: "10px" }} aria-label="menu">
				<MenuIcon />
			</IconButton>
			<InputBase
				id="search"
				sx={{
					ml: 1,
					flex: 1,
					color: "primary.light",
					fontFamily: ["Sen"],
				}}
				placeholder="a lentil dish with plenty of greens..."
				inputProps={{ "aria-label": "search recipes" }}
				onChange={() => {
					updateSearch();
				}}
			/>
			<IconButton type="button" sx={{ p: "10px" }} aria-label="search">
				<SearchIcon />
			</IconButton>
		</Paper>
	);
}
