import {
	Box,
	Button,
	Checkbox,
	Container,
	FormLabel,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Menu,
	OutlinedInput,
	TextField,
	Typography,
} from "@mui/material";
import { RemoveCircle as RemoveCircleIcon } from "@mui/icons-material";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setNutrients } from "./creationSlice";
import { Nutrient } from "../../api/models";

const defaultNutritions: string[] = ["Sugar", "Protein", "Sodium", "Calories"];

const allNutrients = [
	"Calories",
	"Fat",
	"Saturated Fat",
	"Carbohydrates",
	"Sugar",
	"Cholestorol",
	"Sodium",
	"Protein",
	"Fiber",
];

const defaultNutri: Nutrient[] = allNutrients.map((name) => ({
	name: name,
	amount: "",
	indented: false,
	percentOfDailyNeeds: "0",
}));

const defaultUnselected = allNutrients.filter(
	(x) => defaultNutritions.indexOf(x) < 0
);

function NutritionItem({
	nutrition,
	id,
	remove,
	update,
}: {
	nutrition: Nutrient;
	id: number;
	remove: Function;
	update: Function;
}) {
	return (
		<Container disableGutters sx={{ display: "flex", alignItems: "top" }}>
			<RemoveCircleIcon
				sx={{ color: "primary.dark", fontSize: "32px", mt: "10px" }}
				onClick={() => {
					remove(nutrition.name, false);
				}}
			/>
			<Container
				disableGutters
				sx={{ flex: 1, px: "10px", alignSelf: "center" }}
			>
				<Typography variant="h6" component="h6" fontWeight={700}>
					{nutrition.name}
				</Typography>
			</Container>
			<Container disableGutters sx={{ flex: 6, px: "10px" }}>
				<TextField
					autoFocus
					fullWidth
					id={`nutrition-${nutrition.name}`}
					className="recipeInput"
					placeholder="100g"
					multiline
					onChange={(e) => update(e.target.value, id)}
					value={nutrition.amount}
				></TextField>
			</Container>
		</Container>
	);
}

// idea: click on item in menu and it moves to list
//       in reverse for clicking '-'

function NutrientSelector({
	items,
	setSelected,
}: {
	items: string[];
	setSelected: Function;
}) {
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleToggle = (value: string) => () => {
		setSelected(value, true);
	};

	return (
		<div>
			<Button
				id="nutrientButton"
				aria-controls={open ? "basic-menu" : undefined}
				aria-haspopup="true"
				aria-expanded={open ? "true" : undefined}
				onClick={handleClick}
				variant="contained"
				sx={{}}
			>
				Select Nutrition Items
			</Button>
			<Menu
				id="nutrientMenu"
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				MenuListProps={{
					"aria-labelledby": "nutrient-button",
				}}
				sx={{
					"& .MuiPaper-root": {
						backgroundColor: "primary.light",
						p: "2px 10px",
					},
				}}
			>
				<List disablePadding>
					{items.map((nutri) => {
						const labelId = `checkbox-list-label-${nutri}`;

						return (
							<ListItem key={nutri} disablePadding>
								<ListItemButton
									role={undefined}
									onClick={handleToggle(nutri)}
								>
									<ListItemText
										id={labelId}
										primary={nutri}
									/>
								</ListItemButton>
							</ListItem>
						);
					})}
				</List>
			</Menu>
		</div>
	);
}

function NutritionList() {
	const dispatch = useDispatch();

	const [selected, setSelected] = useState<string[]>(defaultNutritions);
	const [unselected, setUnselected] = useState<string[]>(defaultUnselected);
	const [nutriList, setNutriList] = useState<Nutrient[]>(defaultNutri);

	console.log("SELECTED", selected);
	console.log("UNSELECTED", unselected);

	// stil need to add
	// setNutriList([...nutriList, temp]);

	const updateList = (value: string, id: number) => {
		const newList = [...nutriList];
		newList[id].amount = value;
		dispatch(setNutrients(newList));
		setNutriList(newList);
	};

	const swapSelected = (value: string, select: boolean) => {
		let newSelected: string[];
		let newUnselected: string[];

		if (select) {
			console.log("going to select");
			newSelected = [...selected, value];
			newUnselected = [...unselected];
			newUnselected.splice(newUnselected.indexOf(value), 1);
		} else {
			newSelected = [...selected];
			newSelected.splice(newSelected.indexOf(value), 1);
			newUnselected = [...unselected, value];
		}

		console.log(selected);
		console.log(unselected);
		console.log(newSelected);
		console.log(newUnselected);
		setSelected(newSelected);
		setUnselected(newUnselected);
	};

	const saveRecipe = () => {};

	return (
		<Box
			component="div"
			sx={{
				backgroundColor: "primary.main",
				p: "6px 10px",
				m: "20px",
				borderRadius: "8px",
				display: "flex",
				flexDirection: "column",
				alignItems: "left",
				width: "100%",
			}}
		>
			<Typography
				variant="h6"
				component="h6"
				fontWeight={700}
				sx={{
					mr: "1rem",
				}}
			>
				Nutrition Information:
			</Typography>
			<NutrientSelector items={unselected} setSelected={swapSelected} />
			<List>
				{nutriList
					?.filter((item) => selected.indexOf(item.name) > -1)
					.map((nutri, i) => {
						return (
							<NutritionItem
								nutrition={nutri}
								key={`nutri-${i}`}
								id={i}
								remove={swapSelected}
								update={updateList}
							/>
						);
					})}
			</List>
		</Box>
	);
}

export default NutritionList;
