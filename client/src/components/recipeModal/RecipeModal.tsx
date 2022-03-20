import { Modal, Backdrop, Fade, Typography, Box } from "@mui/material";
import React, { useEffect, useState } from "react";

import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { closeModal, selectModal } from "./modalSlice";

import { Recipe } from "../../api/models";

// import { getRecipe } from "../../api/requests"

function RecipeModal() {
	const dispatch = useAppDispatch();
	const handleClose = () => dispatch(closeModal());

	const modalInfo = useAppSelector(selectModal);
	const open = modalInfo.isOpen;

	const [recipe, setRecipe] = useState<Recipe>();

	useEffect(() => {
		// data = getRecipe(modalInfo.ID, modalInfo.isCookbookID)
		// setRecipe(data)
	}, [open]);

	return (
		<div>
			{console.log(open ? "we are open" : "we are closed")}
			<Modal
				aria-labelledby="recipeModal"
				aria-describedby="recipeModalDesc"
				open={open}
				onBackdropClick={handleClose}
				onClose={handleClose}
				closeAfterTransition
				BackdropComponent={Backdrop}
				BackdropProps={{ timeout: 500 }}
			>
				<Fade in={open}>
					<Box
						component="div"
						sx={{
							position: "absolute",
							top: "50%",
							left: "50%",
							transform: "translate(-50%, -50%)",

							width: 400,
							bgcolor: "primary.light",
							border: "2px solid primary.main",
							boxShadow: 12,
							p: "12px",
						}}
					>
						<Typography variant="h6" component="h2">
							Howdy Gamers
						</Typography>
						<Typography variant="h6" component="h2">
							ID: {modalInfo.id}
						</Typography>
					</Box>
				</Fade>
			</Modal>
		</div>
	);
}

export default RecipeModal;
