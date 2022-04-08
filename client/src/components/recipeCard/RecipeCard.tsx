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
import { positions } from "@mui/system";

export function RecipeCard(props: SimpleRecipe) {
	const dispatch = useAppDispatch();

	function updateSelectedRecipe() {
		if (props.cookbookID >= "0") {
			dispatch(setModal({ id: props.cookbookID, isCookbookID: true }));
		} else {
			console.log(props.spoonacularID);
			dispatch(
				setModal({ id: "" + props.spoonacularID, isCookbookID: false })
			);
		}

		dispatch(openModal());
	}

	const isFavorited: boolean = useAppSelector(
		selectFavoriteByID(props.cookbookID)
	);

	const toggleFav = (e: any) => {
		e.stopPropagation();
		dispatch(updateFavorite({ id: props.cookbookID, set: !isFavorited }));
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
			<CardMedia
				component="img"
				sx={{
					height: "200px",
					pt: "56.25",
					position: "relative",
					zIndex: "modal",
				}}
				image={
					props.imageURL
						? props.imageURL
						: "https://source.unsplash.com/random"
				}
				alt="food image"
			/>

			<IconButton
				aria-label="favorite"
				size="large"
				onClick={toggleFav}
				sx={{
					height: "64px",
					width: "64px",
					position: "absolute",
					right: "0",
					top: "0",
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

			<CardContent sx={{ position: "relative" }}>
				<Typography
					gutterBottom
					variant="h5"
					component="h3"
					sx={{
						zIndex: "tooltip",
						color: "primary.contrastText",
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
						width: "60px",
						height: "30px",
						justifyContent: "center",
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
							fontSize: "30px",
							textAlign: "center",
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
