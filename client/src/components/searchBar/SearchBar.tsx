import React from "react";
import { IconButton, InputBase, Paper } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";

import SearchMenu from "./SearchMenu";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectSearch, setSearchTags } from "./searchSlice";
import Tag from "../tag/Tag";

interface searchBarProps {
	searchFunc: React.MouseEventHandler<HTMLButtonElement>;
	paperProps?: any;
}

let typingTimer: number;
const doneTypingInterval = 400;

export default function SearchBar({ searchFunc, paperProps }: searchBarProps) {
	const dispatch = useAppDispatch();

	const searchOpts = useAppSelector(selectSearch);
	const tags = searchOpts.searchTags;

	const removeTag = (e: any) => {
		dispatch(
			setSearchTags(tags.filter((tag) => tag !== e.target.textContent))
		);
	};

	const countdownSearch: React.ChangeEventHandler<
		HTMLInputElement | HTMLTextAreaElement
	> = (e) => {
		clearTimeout(typingTimer);
		typingTimer = setTimeout(searchFunc, doneTypingInterval);
	};

	return (
		<Paper
			component="div"
			sx={{
				p: "2px 4px",
				display: "flex",
				alignItems: "center",
				backgroundColor: "primary.dark",
				...paperProps,
			}}
		>
			<SearchMenu />
			{tags?.map((tag, i) => (
				<Tag name={tag} onClick={removeTag} key={tag + i} />
			))}
			<InputBase
				id="search"
				sx={{
					ml: 1,
					flex: 1,
					color: "primary.light",
					fontFamily: ["Helvetica Neue", "Sen"],
				}}
				placeholder="a lentil dish with plenty of greens..."
				inputProps={{ "aria-label": "search recipes" }}
				onChange={countdownSearch}
			/>
			<IconButton
				type="button"
				sx={{ p: "10px" }}
				aria-label="search"
				onClick={searchFunc}
			>
				<SearchIcon />
			</IconButton>
		</Paper>
	);
}
