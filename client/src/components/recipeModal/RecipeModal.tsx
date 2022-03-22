import {
	Modal,
	Backdrop,
	Fade,
	Typography,
	Box,
	Paper,
	CardMedia,
	Container,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Scrollbars } from "react-custom-scrollbars";

import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { closeModal, selectModal } from "./modalSlice";

import { Recipe } from "../../api/models";

// import { getRecipe } from "../../api/requests"

interface contentProps {
	recipe: Recipe;
}

function RecipeModalContent({ recipe }: contentProps) {
	return (
		<Box
			component="div"
			sx={{
				position: "absolute",
				top: "50%",
				left: "50%",
				transform: "translate(-50%, -50%)",
				minWidth: "400px",
				maxHeight: "80%",
				bgcolor: "primary.light",
				border: "2px solid #fff",
				borderRadius: "35px",
				boxShadow: 12,
				overflowX: "hidden",
				overflowY: "auto",
				scrollbarWidth: "none",
			}}
		>
			<Scrollbars
				renderTrackHorizontal={() => <div></div>}
				renderThumbHorizontal={() => <div></div>}
				thumbSize={180}
				style={{ height: 600, overflowX: "hidden" }}
			>
				{/* IMAGE */}
				<CardMedia
					component="img"
					sx={{
						height: "200px",
						borderRadius: "35px 35px 0px 0px",
					}}
					image={
						recipe.imageURL
							? recipe.imageURL
							: "https://source.unsplash.com/random"
					}
					alt="food image"
				/>
				{/* TAGS */}
				<Container
					disableGutters
					sx={{
						position: "absolute",
						display: "flex",
						flexWrap: "wrap",
						top: "150px",
						left: "10px",
						width: "80%",
					}}
				>
					{recipe.tags?.map((tag) => (
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
						>
							{tag}
						</Box>
					))}
				</Container>
				{/* TITLE AND SUBTITLE */}
				<Box
					component="div"
					sx={{
						backgroundColor: "primary.dark",
						top: 0,
						p: "10px",
						position: "sticky",
					}}
				>
					<Typography
						variant="h3"
						component="h3"
						sx={{
							color: "primary.darkContrastText",
							fontWeight: 700,
						}}
					>
						{recipe.name}
					</Typography>
					<Typography
						variant="h6"
						component="h6"
						sx={{ color: "primary.darkContrastText" }}
					>
						Ready in {recipe.readyInMinutes}m
					</Typography>
				</Box>
				{/* REQUIRED INGREDIENTS */}
				<Container disableGutters sx={{ p: "10px" }}>
					<Box
						component="div"
						sx={{
							backgroundColor: "primary.main",
							p: "6px",
							m: "10px",
							borderRadius: "8px",
						}}
					>
						<Typography
							variant="h6"
							component="h6"
							fontWeight={700}
						>
							Required Ingredients:
						</Typography>
						<Container
							disableGutters
							sx={{
								borderLeft: "2px solid",
								borderColor: "primary.dark",
								pl: "5px",
							}}
						>
							{recipe.ingredients?.map((ingredient) => (
								<Typography
									key={ingredient.name}
									variant="body1"
									component="h5"
									sx={{
										p: "1px",
									}}
								>
									{ingredient.name}: {ingredient.amount}{" "}
									{ingredient.unit}
								</Typography>
							))}
						</Container>
					</Box>

					{/* NUTRITION */}
					<Box
						component="div"
						sx={{
							backgroundColor: "primary.main",
							p: "6px",
							m: "10px",
							borderRadius: "8px",
						}}
					>
						<Typography
							variant="h6"
							component="h6"
							fontWeight={700}
						>
							Nutrition Information:
						</Typography>
						<Container
							disableGutters
							sx={{
								borderLeft: "2px solid",
								borderColor: "primary.dark",
								pl: "5px",
							}}
						>
							{recipe.ingredients?.map((ingredient) => (
								<Typography
									key={ingredient.name}
									variant="body1"
									component="h5"
									sx={{
										p: "1px",
									}}
								>
									{ingredient.name}: {ingredient.amount}{" "}
									{ingredient.unit}
								</Typography>
							))}
						</Container>
					</Box>
					{/* INSTRUCTIONS */}
					<Box
						component="div"
						sx={{
							backgroundColor: "primary.main",
							p: "6px",
							m: "10px",
							borderRadius: "8px",
						}}
					>
						<Typography
							variant="h6"
							component="h6"
							fontWeight={700}
						>
							Steps to Follow:
						</Typography>

						{recipe.instructions.length > 0 ? (
							recipe.instructions?.map((instruction) => (
								<Typography
									key={instruction.number + "i"}
									variant="body1"
									component="h5"
									sx={{
										p: "1px",
									}}
								>
									{instruction.number}: Ingredients Needed:{" "}
									{instruction.ingredients}
									{instruction.description}
								</Typography>
							))
						) : (
							<Typography
								key="texxt"
								variant="body1"
								component="h5"
								sx={{
									p: "1px",
								}}
							>
								{}
								these are instructions Non etiam tempor id arcu
								magna ante eget. Nec per posuere cubilia cras
								porttitor condimentum orci suscipit. Leo
								maecenas in tristique, himenaeos elementum
								placerat. Taciti rutrum nostra, eget cursus
								velit ultricies. Quam molestie tellus himenaeos
								cubilia congue vivamus ultricies. Interdum
								praesent ut penatibus fames eros ad consectetur
								sed.
							</Typography>
						)}
					</Box>
				</Container>
			</Scrollbars>
		</Box>
	);
}

const dataA: Recipe = {
	cbID: 0,
	sID: 0,
	ingredients: [
		{ name: "Spinach", amount: 1, unit: "cup" },
		{ name: "Grass", amount: 2, unit: "oz" },
		{ name: "Cheese", amount: 5, unit: "mb" },
	],
	instructions: [],
	name: "Chicken Paella",
	savedAt: "5:04 PM, Friday 14th 2021",
	username: "jo",
	imageURL: "https://source.unsplash.com/random",
	readyInMinutes: 15,
	tags: ["chicken", "mars", "vegan"],
};

function RecipeModal() {
	const dispatch = useAppDispatch();
	const handleClose = () => dispatch(closeModal());

	const modalInfo = useAppSelector(selectModal);
	const open = modalInfo.isOpen;

	const [recipe, setRecipe] = useState<Recipe>(dataA);

	useEffect(() => {
		// data = getRecipe(modalInfo.ID, modalInfo.isCookbookID)
		// setRecipe(data);
	}, [open]);

	return (
		<div>
			{console.log(open ? "we are open" : "we are closed")}
			<Modal
				aria-labelledby="recipeModal"
				aria-describedby="recipeModalDesc"
				open={open}
				onClose={handleClose}
				closeAfterTransition
				BackdropComponent={Backdrop}
				BackdropProps={{ timeout: 500 }}
			>
				<Fade in={open}>
					<div>
						<RecipeModalContent recipe={recipe} />
					</div>
				</Fade>
			</Modal>
		</div>
	);
}

export default RecipeModal;
