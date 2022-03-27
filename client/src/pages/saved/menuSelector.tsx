import {
	Container,
	IconButton,
	Menu,
	MenuItem,
	Typography,
} from "@mui/material";
import { KeyboardArrowDown as DownIcon } from "@mui/icons-material";
import React, { useState } from "react";

interface SelectorProps {
	getCollection: Function;
	props: any;
}

const textOptions = ["My Recipes", "Favorites"];

function menuSelector({ getCollection, props }: SelectorProps) {
	const [text, setText] = useState(0);

	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleCloseItem = () => {
		setText(1 - text);
		getCollection(textOptions[text]);

		setAnchorEl(null);
	};

	return (
		<Container disableGutters sx={{ display: "flex", ...props }}>
			<IconButton
				aria-label="select"
				id="recipeGroupSelector"
				aria-controls={open ? "groupSelectorMenu" : undefined}
				aria-expanded={open ? "true" : undefined}
				aria-haspopup="true"
				onClick={handleClick}
			>
				<DownIcon sx={{ color: "#000" }} />
			</IconButton>
			<Typography
				variant="h3"
				component="h3"
				id="collectionTitle"
				sx={{ whiteSpace: "nowrap", mr: "1rem" }}
			>
				{textOptions[text]}
			</Typography>
			<Menu
				id="groupSelectorMenu"
				MenuListProps={{
					"aria-labelledby": "groupSelectorMenu",
				}}
				anchorEl={anchorEl}
				anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
				open={open}
				onClose={handleClose}
				PaperProps={{
					sx: {
						backgroundColor: "primary.main",
					},
				}}
			>
				<MenuItem onClick={handleCloseItem}>
					<Typography variant="h4" component="h4">
						{textOptions[1 - text]}
					</Typography>
				</MenuItem>
			</Menu>
		</Container>
	);
}

export default menuSelector;
