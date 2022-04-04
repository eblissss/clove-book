import {
	Modal,
	Backdrop,
	Fade,
	Typography,
	Box,
	CardMedia,
	Container,
	SpeedDialIcon,
	SpeedDial,
	SpeedDialAction,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Scrollbars } from "react-custom-scrollbars";

import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { closeModal, selectModal } from "./modalSlice";

import { Recipe } from "../../api/models";
import Tag from "../tag/Tag";
import { getRecipe } from "../../api/requests";

import {
	Edit as EditIcon,
	DeleteForever as DeleteIcon,
	Menu as MenuIcon,
} from "@mui/icons-material";
import { store } from "../../app/store";
import { setRecipe } from "./recipeSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import {
	setCreationEditing,
	setCreationSuccess,
} from "../../pages/create/creationUpdateSlice";

interface contentProps {
	recipe: Recipe;
}

function RecipeModalContent({ recipe }: contentProps) {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [canEdit, setCanEdit] = useState(false);

	useEffect(() => {
		const userID = store.getState().user.user.userID;
		console.log(recipe.authorID === userID);
		setCanEdit(recipe.authorID === userID);
	}, []);

	const edit = () => {
		dispatch(setRecipe(recipe));
		dispatch(setCreationEditing(recipe.cookbookID));
		console.log(recipe);
		console.log(recipe.cookbookID);
		navigate("/create");
	};

	const deleteDialog = () => {};

	return (
		<Box
			component="div"
			sx={{
				position: "absolute",
				top: "50%",
				left: "50%",
				transform: "translate(-50%, -50%)",
				minWidth: "70%",
				maxHeight: "85%",
				bgcolor: "primary.light",
				border: "2px solid #fff",
				borderRadius: "20px",
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
					{recipe.tags?.map((tag, i) => (
						<Tag name={tag} key={tag + i} />
					))}
				</Container>
				{/* EDIT AND DELETE MENU */}
				{canEdit ? (
					<SpeedDial
						ariaLabel="editDial"
						icon={
							<SpeedDialIcon
								icon={<MenuIcon />}
								openIcon={<EditIcon />}
								onClick={edit}
							/>
						}
						sx={{ position: "absolute", top: "20px", left: "20px" }}
						direction="right"
					>
						<SpeedDialAction
							icon={<DeleteIcon />}
							tooltipTitle={"Delete"}
							sx={{
								bgcolor: "primary.main",
							}}
							onClick={deleteDialog}
						/>
					</SpeedDial>
				) : (
					<></>
				)}
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
							color: "primary.contrastText",
							fontWeight: 700,
						}}
					>
						{recipe.name}
					</Typography>
					<Typography
						variant="h6"
						component="h6"
						sx={{ color: "primary.contrastText" }}
					>
						Ready in {recipe.totalTime}m {" - "} {recipe.prepTime}m
						Prep
						{" + "}
						{recipe.cookTime}m Cook
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
							{recipe.nutrients?.good
								.concat(recipe.nutrients?.bad)
								.map((nutrient) => (
									<Typography
										key={nutrient.name}
										variant="body1"
										component="h5"
										sx={{
											p: "1px",
										}}
									>
										{nutrient.name}: {nutrient.amount}
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

						{recipe.instructions !== null &&
						recipe.instructions.length > 0 ? (
							recipe.instructions?.map((instruction, i) => (
								<Typography
									key={"instruction-" + i}
									variant="body1"
									component="h5"
									sx={{
										p: "1px",
									}}
								>
									{i + 1}. {instruction.description}
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
								1. go frick yourself. 2. these are instructions.
								3. Non etiam tempor id arcu magna ante eget. Nec
								per posuere cubilia cras porttitor condimentum
								orci suscipit. Leo maecenas in tristique,
								himenaeos elementum placerat. Taciti rutrum
								nostra, eget cursus velit ultricies. Quam
								molestie tellus himenaeos cubilia congue vivamus
								ultricies. Interdum praesent ut penatibus fames
								eros ad consectetur sed.
							</Typography>
						)}
					</Box>
				</Container>
			</Scrollbars>
		</Box>
	);
}

const dataA: Recipe = {
	cookbookID: "0",
	spoonacularID: 0,
	ingredients: [
		{ name: "Spinach", amount: 1, unit: "cup" },
		{ name: "Grass", amount: 2, unit: "oz" },
		{ name: "Cheese", amount: 5, unit: "mb" },
	],
	instructions: [],
	name: "Chicken Paella",
	savedAt: "5:04 PM, Friday 14th 2021",
	author: "jo",
	authorID: "1231",
	imageURL: "https://source.unsplash.com/random",
	totalTime: 15,
	tags: ["chicken", "mars", "vegan"],
	cookTime: 5,
	prepTime: 10,
	createdAt: "5:04 PM, Friday 14th 2021",
	nutrients: {
		good: [],
		bad: [],
	},
};

function RecipeModal() {
	const dispatch = useAppDispatch();
	const handleClose = () => dispatch(closeModal());

	const modalInfo = useAppSelector(selectModal);
	const open = modalInfo.isOpen;

	const [recipe, setRecipe] = useState<Recipe>(dataA);

	useEffect(() => {
		// TEMPORARY - REMOVE WHEN SPOON RECIPES FIXED
		if (modalInfo.id == "0") {
			return;
		}
		if (open) {
			getRecipe("" + modalInfo.id).then((data) => {
				console.log(data);
				setRecipe(data);
			});
		}
	}, [open]);

	return (
		<div>
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
