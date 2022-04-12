import { Paper, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../app/hooks";
import Tag from "../../components/tag/Tag";
import { selectCreationTags, setRecipeTags } from "./creationSlice";

function TagsInput() {
	const dispatch = useDispatch();

	const [tags, setTags] = useState<string[]>([]);
	const [input, setInput] = useState("");

	const removeTag = (e: any) => {
		const tempTags = [...tags];
		setTags(tempTags.filter((tag) => tag !== e.target.textContent));
	};

	const updateInput = (e: any) => {
		setInput(e.target.value);
	};

	const reduxTags = useAppSelector(selectCreationTags);
	useEffect(() => {
		setTags(reduxTags);
	}, [reduxTags]);

	const saveTags = () => {
		dispatch(setRecipeTags(tags));
	};
	document
		.getElementById("createSubmit")
		?.addEventListener("click", saveTags);

	const updateTags = (e: any) => {
		const updateKey = e.key === "," || e.key === "Enter";
		const backKey = e.key === "Backspace";

		if (updateKey && input.length && !tags.includes(input)) {
			e.preventDefault();
			setTags((tags) => [...tags, input]);
			setInput("");
		} else if (updateKey) {
			e.preventDefault();
			setInput("");
		} else if (backKey && !input.length && tags.length) {
			e.preventDefault();
			const tempTags = [...tags];
			setInput(tempTags.pop()!);
			setTags(tempTags);
		}
	};

	return (
		<Paper
			component="div"
			sx={{
				p: "2px 4px",
				display: "flex",
				alignItems: "center",
				backgroundColor: "primary.dark",
				m: "5px",
				flex: 4,
			}}
		>
			{tags?.map((tag, i) => (
				<Tag name={tag} onClick={removeTag} key={tag + i} />
			))}
			<TextField
				onChange={updateInput}
				onKeyDown={updateTags}
				id="recipeTags"
				placeholder="lentils"
				value={input}
				sx={{
					flex: 4,

					"& .MuiInputBase-root": {
						"& input": {
							color: "primary.contrastText",
							height: "0px",
							fontFamily: ["Sen"],
							fontSize: "18px",
							fontWeight: 700,
						},
						"& fieldset": {
							border: "none",
							borderRadius: "8px",
							paddingLeft: "0.5rem",
							margin: "-0.05rem",
						},
						"&:hover fieldset": {
							borderWidth: "0rem",
						},
						"&.Mui-focused fieldset": {
							borderWidth: "0rem",
						},
					},
				}}
			></TextField>
		</Paper>
	);
}

export default TagsInput;
