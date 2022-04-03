import { Alert, Snackbar, Slide } from "@mui/material";
import React, { useState } from "react";

function CreateSuccess() {
	const [open, setOpen] = useState(true);

	const handleClose = (
		event?: React.SyntheticEvent | Event,
		reason?: string
	) => {
		if (reason === "clickaway") {
			return;
		}
		setOpen(false);
	};

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
				severity="success"
				sx={{ width: "100%" }}
			>
				{"Success! Recipe Added"}
			</Alert>
		</Snackbar>
	);
}

export default CreateSuccess;
