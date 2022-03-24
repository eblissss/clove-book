import React from "react";
import { Alert, Slide, Snackbar } from "@mui/material";

import { closeError, selectError } from "./errorSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

function ErrorPopup() {
	const dispatch = useAppDispatch();

	const handleClose = (
		event?: React.SyntheticEvent | Event,
		reason?: string
	) => {
		if (reason === "clickaway") {
			return;
		}
		dispatch(closeError());
	};

	const errorInfo = useAppSelector(selectError);
	const open = errorInfo.isOpen;

	return (
		<Slide in={open} direction="down">
			<Snackbar
				open={true}
				autoHideDuration={3000}
				anchorOrigin={{ vertical: "top", horizontal: "center" }}
				onClose={handleClose}
			>
				<Alert
					onClose={handleClose}
					severity="error"
					sx={{ width: "100%" }}
				>
					{errorInfo.error}
				</Alert>
			</Snackbar>
		</Slide>
	);
}

export default ErrorPopup;
