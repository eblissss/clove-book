import {
	Box,
	Card,
	CardContent,
	CardMedia,
	Typography,
	alpha,
	IconButton,
	Tooltip,
} from "@mui/material";
import React from "react";
import { SimpleRecipe } from "../../api/models";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { openModal, setModal } from "../recipeModal/modalSlice";
import { addSearchTag } from "../searchBar/searchSlice";
import Tag from "../tag/Tag";
import { palette } from "../../theme";
import { selectFavoriteByID, updateFavorite } from "../userFavs/favSlice";
import {
	FavoriteBorder as Unfavorited,
	Favorite as Favorited,
} from "@mui/icons-material";

export function RecipeCard(props: SimpleRecipe) {
	const dispatch = useAppDispatch();

	const recipeID =
		props.cookbookID === "100000000000000000000000"
			? "" + props.spoonacularID
			: props.cookbookID;

	function updateSelectedRecipe() {
		dispatch(setModal({ id: recipeID }));
		dispatch(openModal());
	}

	const isFavorited: boolean = useAppSelector(selectFavoriteByID(recipeID));

	const toggleFav = (e: any) => {
		e.stopPropagation();
		dispatch(
			updateFavorite({
				id: recipeID,
				set: !isFavorited,
			})
		);
	};

	const cardTagClick = (e: any) => {
		e.stopPropagation();
		dispatch(addSearchTag(e.target.textContent));
	};

	return (
		<Card
			sx={{
				position: "relative",
				display: "flex",
				flexDirection: "column",
				borderRadius: "20px",
				backgroundColor: "primary.dark",
				maxWidth: "100%",
			}}
			onClick={updateSelectedRecipe}
		>
			<IconButton
				// disableRipple
				aria-label="favorite"
				onClick={toggleFav}
				sx={{
					// height: "64px",
					// width: "64px",
					position: "absolute",
					right: "0",
					top: "0",
					zIndex: "drawer",
				}}
			>
				{isFavorited ? (
					<Tooltip title="Remove from favorites">
						<Favorited
							sx={{
								color: "secondary.main",
								fontSize: "1.5em",
							}}
						/>
					</Tooltip>
				) : (
					<Tooltip title="Add to favorites">
						<Unfavorited
							sx={{
								color: "primary.contrastText",
								fontSize: "1.5em",
							}}
						/>
					</Tooltip>
				)}
			</IconButton>
			<CardMedia
				component="img"
				sx={{
					height: "200px",
					pt: "56.25",
					position: "relative",
					zIndex: "app bar",
				}}
				image={
					props.imageURL
						? props.imageURL
						: "https://picsum.photos/400"
				}
				alt="food image"
			/>

			{/* TITLE and TAGS */}
			<CardContent sx={{ position: "relative" }}>
				<Typography
					gutterBottom
					variant="h5"
					component="h5"
					sx={{
						fontFamily: ["serif", "Libre Baskerville"],
						color: "primary.contrastText",
						justifyContent: "center",
					}}
				>
					{props.name}
				</Typography>
				<Box
					component="div"
					sx={{
						position: "absolute",
						left: "0px",
						top: "-30px",
						width: "auto",
						height: "auto",
						justifyContent: "center",
						alignContent: "center",
						borderRadius: "0 10px 0 0",
						backgroundColor: alpha(palette.primary.dark, 0.7),
					}}
				>
					<Typography
						gutterBottom
						variant="h5"
						component="h5"
						sx={{
							color: "primary.contrastText",
							textAlign: "center",
							px: "5px",
						}}
					>
						{props.totalTime}m
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
