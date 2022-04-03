import {
	Box,
	Button,
	Container,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Menu,
	TextField,
	Typography,
} from "@mui/material";
import {
	RemoveCircle as RemoveCircleIcon,
	AddCircle as AddCircleIcon,
} from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { selectCreation, setNutrients } from "./creationSlice";
import { Nutrient } from "../../api/models";
import { useAppSelector } from "../../app/hooks";
import { selectCreationUpdate } from "./creationUpdateSlice";

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
	percentOfDailyNeeds: 0,
}));

const defaultUnselected = allNutrients.filter(
	(x) => defaultNutritions.indexOf(x) < 0
);

function NutritionItem({
	nutrition,
	remove,
	update,
}: {
	nutrition: Nutrient;
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
					fullWidth
					id={`nutrition-${nutrition.name}`}
					className="recipeInput"
					placeholder="100g"
					multiline
					onChange={(e) => update(e.target.value, nutrition)}
					value={nutrition.amount}
				></TextField>
			</Container>
		</Container>
	);
}

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
				sx={{
					backgroundColor: "secondary.main",
					color: "primary.light",
				}}
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
									<ListItemIcon>
										<AddCircleIcon />
									</ListItemIcon>

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

	const success = useAppSelector(selectCreationUpdate).success;
	useEffect(() => {
		if (success) {
			setNutriList([]);
			dispatch(setNutrients([]));
		}
	}, [success]);

	const reduxNutrients = useAppSelector(selectCreation).nutrients;
	useEffect(() => {
		if (reduxNutrients.length > nutriList.length) {
			setNutriList(reduxNutrients);
		}
	}, []);

	const updateList = (value: string, nutr: Nutrient) => {
		const newList = [...nutriList];
		newList[newList.indexOf(nutr)].amount = value;
		setNutriList(newList);
	};

	const swapSelected = (value: string, select: boolean) => {
		let newSelected: string[];
		let newUnselected: string[];

		if (select) {
			newSelected = [...selected, value];
			newUnselected = [...unselected];
			newUnselected.splice(newUnselected.indexOf(value), 1);
		} else {
			newSelected = [...selected];
			newSelected.splice(newSelected.indexOf(value), 1);
			newUnselected = [...unselected, value];
		}

		setSelected(newSelected);
		setUnselected(newUnselected);
	};

	const saveNutritions = () => {
		dispatch(setNutrients(nutriList));
	};
	document
		.getElementById("createSubmit")
		?.addEventListener("click", saveNutritions);

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
