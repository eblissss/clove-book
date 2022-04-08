import {
	Modal,
	Backdrop,
	Fade,
	Typography,
	Box,
	CardMedia,
	Container,
	IconButton,
	LinearProgress,
	Tooltip,
	Dialog,
	DialogTitle,
	Button,
	DialogActions,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Scrollbars } from "react-custom-scrollbars";

import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { closeModal, selectModal } from "./modalSlice";

import { Recipe } from "../../api/models";
import Tag from "../tag/Tag";
import { deleteRecipe, getRecipe } from "../../api/requests";

import {
	Edit as EditIcon,
	DeleteForever as DeleteIcon,
	FavoriteBorder as Unfavorited,
	Favorite as Favorited,
} from "@mui/icons-material";
import { store } from "../../app/store";
import { setRecipe } from "./recipeSlice";

import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { setCreationEditing } from "../../pages/create/creationUpdateSlice";
import { openError, setError } from "../errorPopup/errorSlice";
import { selectFavoriteByID, updateFavorite } from "../userFavs/favSlice";

interface contentProps {
	recipe: Recipe;
	setOpenDeleteDialog: Function;
}

function RecipeModalContent({ recipe, setOpenDeleteDialog }: contentProps) {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [canEdit, setCanEdit] = useState(false);

	if (recipe == undefined) {
		recipe = dataA;
	}

	const isFavorited: boolean = useAppSelector(
		selectFavoriteByID(recipe.cookbookID)
	);

	useEffect(() => {
		const userID = store.getState().user.user.userID;
		setCanEdit(recipe.authorID === userID);
	}, []);

	const doEdit = () => {
		dispatch(setRecipe(recipe));
		dispatch(setCreationEditing(recipe.cookbookID));
		dispatch(closeModal());
		navigate("/create");
	};

	const doDelete = () => {
		setOpenDeleteDialog(true);
	};

	const toggleFav = () => {
		dispatch(updateFavorite({ id: recipe.cookbookID, set: !isFavorited }));
	};

	return (
		<Box
			component="div"
			sx={{
				position: "absolute",
				top: "50%",
				left: "50%",
				transform: "translate(-50%, -50%)",
				minWidth: "180px",
				width: "50%",
				maxHeight: "90%",
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
				{/* TITLE, SUBTITLE, BUTTONS*/}
				<Box
					component="div"
					sx={{
						backgroundColor: "primary.dark",
						top: 0,

						borderRadius: "20px 20px 0px 0px",
						width: "100%",
						height: "100%",
						maxHeight: "70%",
						// position: "sticky",
						display: "flex",
						flexDirection: "column",
						alignItems: "flex-start",
						justifyContent: "flex-end",
					}}
				>
					<CardMedia
						component="img"
						sx={{
							position: "absolute",
							height: "100%",
							//mixBlendMode: "soft-light",
							opacity: "50%",
							objectFit: "cover",
							width: "100%",
							zIndex: "modal",
						}}
						image={
							recipe.imageURL
								? recipe.imageURL
								: "https://source.unsplash.com/random"
						}
						alt="food image"
					/>
					<Container disableGutters sx={{ padding: "15px" }}>
						<Typography
							variant="h3"
							component="h3"
							sx={{
								zIndex: "tooltip",
								color: "primary.contrastText",
								fontWeight: 700,
							}}
						>
							{recipe.name}
						</Typography>
						<Typography
							variant="h6"
							component="h6"
							sx={{
								position: "relative",
								zIndex: "tooltip",
								color: "primary.contrastText",
							}}
						>
							Ready in {recipe.totalTime}m
							{recipe.prepTime === -1
								? ""
								: ` - ${recipe.prepTime}m Prep + ${recipe.cookTime}m Cook`}
						</Typography>
					</Container>
					<Container
						disableGutters
						sx={{
							ml: "0px",
							width: "auto",
							zIndex: "tooltip",
							// display: "inline-flex",
							// alignItems: "flex-start",
							// alignContent:"flex-start",
							// justifyContent: "flex-start",
						}}
					>
						{/* EDIT AND DELETE MENU */}

						<IconButton
							aria-label="favorite"
							disableRipple
							onClick={toggleFav}
							sx={{
								variant: "Menu",
							}}
						>
							{isFavorited ? (
								<Tooltip title="Unfavorite">
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
						{canEdit ? (
							<>
								<Tooltip title="Edit recipe">
									<IconButton disableRipple sx={{variant: "menu",}} onClick={doEdit}>
										<EditIcon
											sx={{
												fontSize: "1.5em",
												color: "primary.contrastText",
											}}
										/>
									</IconButton>
								</Tooltip>
								<Tooltip title="Delete recipe">
									<IconButton
										disableRipple
										sx={{variant: "menu",}}
										onClick={doDelete}
									>
										<DeleteIcon
											sx={{
												fontSize: "1.5em",
												color: "primary.contrastText",
											}}
										/>
									</IconButton>
								</Tooltip>
							</>
						) : (
							<></>
						)}
					</Container>
				</Box>
				<Container disableGutters sx={{ display: "flex" }}>
					<Container
						disableGutters
						sx={{
							width: "40%",
							minWidth: "auto",
							height: "auto",
							//mr: "10px",
						}}
					>
						{/* REQUIRED INGREDIENTS */}
						<Box
							component="div"
							sx={{
								backgroundColor: "primary.main",
								p: "12px",
								pb: "12px",
								m: "10px",
								mr: "5px",
								borderRadius: "8px",
							}}
						>
							<Typography
								variant="h6"
								component="h6"
								fontWeight={700}
							>
								Ingredients
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
										{ingredient.name}: {ingredient.amount}
										{"\u00A0"}
										{ingredient.unit}
									</Typography>
								))}
							</Container>
						</Box>

						{/* NUTRITION */}
						{recipe.nutrients?.good
							.concat(recipe.nutrients?.bad)
							.filter((x) => x.amount !== "").length != 0 ? (
							<Box
								component="div"
								sx={{
									backgroundColor: "primary.main",
									p: "12px",
									pb: "12px",
									m: "10px",
									mr: "5px",
									borderRadius: "8px",
								}}
							>
								<Typography
									variant="h6"
									component="h6"
									fontWeight={700}
								>
									Nutrition Information
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
										.filter((x) => x.amount !== "")
										.map((nutrient) => (
											<Typography
												key={nutrient.name}
												variant="body1"
												component="h5"
												sx={{
													p: "1px",
												}}
											>
												{nutrient.name}:{" "}
												{nutrient.amount.replace(
													/\s/g,
													"\u00A0"
												)}
											</Typography>
										))}
								</Container>
							</Box>
						) : (
							<></>
						)}
						{/* TAGS */}
						{recipe.tags?.length != 0 ? (
							<Container
								disableGutters
								sx={{
									backgroundColor: "primary.main",
									m: "10px",
									mr: "5px",
									p: "12px",
									borderRadius: "8px",
									width: "auto",
								}}
							>
								<Typography
									variant="h6"
									component="h6"
									fontWeight={700}
								>
									Tags
								</Typography>
								<Container
									disableGutters
									sx={{
										display: "flex",
										flexWrap: "wrap",
										width: "auto",
										ml: "-10px",
									}}
								>
									{recipe.tags?.map((tag, i) => (
										<Tag name={tag} key={tag + i} />
									))}
								</Container>
							</Container>
						) : (
							<></>
						)}
					</Container>
					{/* INSTRUCTIONS */}
					<Box
						component="div"
						sx={{
							backgroundColor: "primary.main",
							p: "10px",
							m: "10px",
							ml: "5px",
							borderRadius: "8px",
							width: "60%",
							minWidth: "40%",
							//ml: "0",
						}}
					>
						<Typography
							variant="h6"
							component="h6"
							fontWeight={700}
						>
							Instructions
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
								key="text"
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

function DeleteDialog({ id, setOpen }: { id: string; setOpen: Function }) {
	const dispatch = useDispatch();

	const handleClose = () => {
		setOpen(false);
	};

	const deleteDialog = () => {
		deleteRecipe(id);
		dispatch(closeModal());
		setOpen(false);
	};

	return (
		<Dialog open={true} onClose={handleClose}>
			<DialogTitle>Delete recipe permanently?</DialogTitle>
			<DialogActions>
				<Button onClick={handleClose}>Cancel</Button>
				<Button onClick={deleteDialog} variant="outlined" color="error">
					Delete
				</Button>
			</DialogActions>
		</Dialog>
	);
}

const dataA: Recipe = {
	cookbookID: "000000000000000000000000",
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
	const [loading, setLoading] = useState(true);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

	useEffect(() => {
		if (open) {
			getRecipe("" + modalInfo.id).then((data) => {
				console.log(data);
				if (data !== undefined && data.name !== "") {
					setRecipe(data);
					setLoading(false);
				} else {
					dispatch(setError("Error: Could not load recipe"));
					dispatch(openError());
				}
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
						{loading ? (
							<LinearProgress />
						) : openDeleteDialog ? (
							<DeleteDialog
								id={recipe.cookbookID}
								setOpen={setOpenDeleteDialog}
							/>
						) : (
							<RecipeModalContent
								recipe={recipe}
								setOpenDeleteDialog={setOpenDeleteDialog}
							/>
						)}
					</div>
				</Fade>
			</Modal>
		</div>
	);
}

export default RecipeModal;
