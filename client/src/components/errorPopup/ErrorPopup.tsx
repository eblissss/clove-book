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
		<Snackbar
			open={open}
			autoHideDuration={3000}
			anchorOrigin={{ vertical: "top", horizontal: "center" }}
			onClose={handleClose}
			TransitionComponent={Slide}
		>
			<Alert
				onClose={handleClose}
				severity="error"
				sx={{ width: "100%" }}
			>
				{errorInfo.error}
			</Alert>
		</Snackbar>
	);
}

export default ErrorPopup;
