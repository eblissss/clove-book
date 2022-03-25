import { Box, Card, CardContent, CardMedia, Typography } from "@mui/material";
import React from "react";

import { SimpleRecipe } from "../../api/models";
import { useAppDispatch } from "../../app/hooks";
import { openModal, setModal } from "../recipeModal/modalSlice";
import { addSearchTag } from "../searchBar/searchSlice";
import Tag from "../tag/Tag";

export function RecipeCard(props: SimpleRecipe) {
	const dispatch = useAppDispatch();

	function updateSelectedRecipe() {
		if (props.cookbookID >= 0) {
			console.log("cookbookID: ", props.cookbookID);
			dispatch(setModal({ id: props.cookbookID, isCookbookID: true }));
		} else {
			console.log(props.spoonacularID);
			dispatch(
				setModal({ id: props.spoonacularID, isCookbookID: false })
			);
		}

		dispatch(openModal());
	}

	const cardTagClick = (e: any) => {
		console.log(e.target.textContent);
		e.stopPropagation();

		dispatch(addSearchTag(e.target.textContent));
	};

	return (
		<Card
			sx={{
				display: "flex",
				flexDirection: "column",
				borderRadius: "20px",
				backgroundColor: "primary.dark",
			}}
			onClick={updateSelectedRecipe}
		>
			<CardMedia
				component="img"
				sx={{
					height: "200px",
					pt: "56.25",
				}}
				image={
					props.imageURL
						? props.imageURL
						: "https://source.unsplash.com/random"
				}
				alt="food image"
			/>
			<CardContent sx={{ position: "relative" }}>
				<Typography
					gutterBottom
					variant="h5"
					component="h3"
					sx={{
						color: "primary.darkContrastText",
					}}
				>
					{props.name}
				</Typography>
				<Box
					component="div"
					sx={{
						position: "absolute",
						right: "0px",
						top: "-30px",
						backgroundColor: "#ffffffaa",
						width: "60px",
						height: "30px",
						justifyContent: "center",
					}}
				>
					<Typography
						gutterBottom
						variant="h5"
						component="h5"
						sx={{
							color: "primary.contrastText",
							fontSize: "30px",
							textAlign: "center",
						}}
					>
						{props.readyInMinutes}m
					</Typography>
				</Box>

				<Box
					component="div"
					sx={{
						display: "flex",
						flexWrap: "wrap",
					}}
				>
					{props.tags?.map((tag, i) => (
						<Tag name={tag} onClick={cardTagClick} key={tag + i} />
					))}
				</Box>
			</CardContent>
		</Card>
	);
}
