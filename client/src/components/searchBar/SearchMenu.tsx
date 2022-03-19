import {
	Checkbox,
	FormControl,
	FormControlLabel,
	FormLabel,
	IconButton,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	ListSubheader,
	Paper,
	Popover,
	Radio,
	RadioGroup,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import React, { useState } from "react";

function FilterList() {
	const [checked, setChecked] = React.useState([""]);

	const handleToggle = (value: string) => () => {
		const currentIndex = checked.indexOf(value);
		const newChecked = [...checked];

		if (currentIndex === -1) {
			newChecked.push(value);
		} else {
			newChecked.splice(currentIndex, 1);
		}

		setChecked(newChecked);
	};

	const options = ["Vegan", "Gluten", "Mayo", "Leaf"];
	return (
		<List disablePadding>
			<FormLabel
				id="sortButtonsLabel"
				sx={{
					marginBottom: "-1rem",
				}}
			>
				Filter By
			</FormLabel>
			{options.map((value) => {
				const labelId = `checkbox-list-label-${value}`;

				return (
					<ListItem key={value} disablePadding>
						<ListItemButton
							role={undefined}
							onClick={handleToggle(value)}
						>
							<ListItemIcon>
								<Checkbox
									edge="start"
									checked={checked.indexOf(value) !== -1}
									tabIndex={-1}
									disableRipple
									inputProps={{ "aria-labelledby": labelId }}
								/>
							</ListItemIcon>
							<ListItemText id={labelId} primary={value} />
						</ListItemButton>
					</ListItem>
				);
			})}
		</List>
	);
}

function SearchMenu() {
	// anchor element
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	const handleClick = (e: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(e.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<div>
			<IconButton
				id="menuButton"
				aria-controls={open ? "menu" : undefined}
				aria-haspopup="true"
				aria-expanded={open ? "true" : undefined}
				aria-label="menu"
				onClick={handleClick}
				sx={{ p: "10px" }}
			>
				<MenuIcon />
			</IconButton>
			<Popover
				id="menu"
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "left",
				}}
			>
				<Paper
					sx={{
						backgroundColor: "primary.light",
						p: "10px",
						display: "flex",
						flexDirection: "row",
					}}
				>
					{/* Sort Radio */}
					<FormControl>
						<FormLabel id="sortButtonsLabel">Sort By</FormLabel>
						<RadioGroup
							aria-aria-labelledby="sortButtonsLabel"
							defaultValue="best"
							name="sortButtonsGroup"
						>
							<FormControlLabel
								value="best"
								control={<Radio />}
								label="Best"
							/>
							<FormControlLabel
								value="alpha"
								control={<Radio />}
								label="Alphabetical"
							/>
							<FormControlLabel
								value="newest"
								control={<Radio />}
								label="Newest"
							/>
						</RadioGroup>
					</FormControl>
					{/* Filter List */}
					<FilterList />
				</Paper>
			</Popover>
		</div>
	);
}

export default SearchMenu;
