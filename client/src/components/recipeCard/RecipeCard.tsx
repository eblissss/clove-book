import {
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	CardMedia,
	Grid,
	Typography,
} from "@mui/material";
import React from "react";

import { SimpleRecipe } from "../../api/models";
import { useAppDispatch } from "../../app/hooks";
import { openModal, setModal } from "../recipeModal/modalSlice";

export function RecipeCard(props: SimpleRecipe) {
	const dispatch = useAppDispatch();

	function updateSelectedRecipe() {
		if (props.cbID >= 0) {
			console.log(props.cbID);
			dispatch(setModal({ id: props.cbID, isCookbookID: true }));
		} else {
			console.log(props.sID);
			dispatch(setModal({ id: props.sID, isCookbookID: false }));
		}

		dispatch(openModal());
	}

	const doThis = (e: any) => {
		console.log(e.target.textContent);
		e.stopPropagation();
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
					{props.tags?.map((tag) => (
						<Box
							key="tag"
							component="div"
							sx={{
								display: "flex",
								color: "white",
								backgroundColor: "green",
								height: "30px",
								borderRadius: "5px",
								p: "5px",
								m: "5px",
								alignItems: "center",
							}}
							onClick={doThis}
						>
							{tag}
						</Box>
					))}
				</Box>
			</CardContent>
			{/* <CardActions>
				<Button size="small">View</Button>
				<Button size="small">Edit</Button>
			</CardActions> */}
		</Card>
	);
}
