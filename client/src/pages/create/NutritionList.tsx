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
					remove(false, nutrition);
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
	items: Nutrient[];
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

	const handleToggle = (nutri: Nutrient) => () => {
		setSelected(true, nutri);
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
				open={open && items.length > 0}
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
							<ListItem key={nutri.name} disablePadding>
								<ListItemButton
									role={undefined}
									onClick={handleToggle(nutri)}
								>
									<ListItemIcon>
										<AddCircleIcon />
									</ListItemIcon>

									<ListItemText
										id={labelId}
										primary={nutri.name}
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

	const [nutriList, setNutriList] = useState<Nutrient[]>([]);

	const reduxNutrients = useAppSelector(selectCreation).nutrients;
	useEffect(() => {
		const newNutrients: Nutrient[] = [];
		reduxNutrients.forEach((nutrient) => {
			newNutrients.push({
				name: nutrient.name,
				amount: nutrient.amount,
				indented: nutrient.indented,
				percentOfDailyNeeds: nutrient.percentOfDailyNeeds,
			});
		});
		console.log(reduxNutrients);
		console.log(nutriList);
		setNutriList([...newNutrients]);
	}, [reduxNutrients]);

	const updateList = (value: string, nutr: Nutrient) => {
		const newList = [...nutriList];
		newList[newList.indexOf(nutr)].amount = value;
		setNutriList(newList);
	};

	const swapSelected = (select: boolean, nutr: Nutrient) => {
		const newList = [...nutriList];
		newList[newList.indexOf(nutr)].indented = select;
		setNutriList(newList);
	};

	const saveNutritions = () => {
		dispatch(setNutrients([...nutriList]));
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
			<NutrientSelector
				items={nutriList.filter((nutri) => !nutri.indented)}
				setSelected={swapSelected}
			/>
			<List>
				{nutriList
					.filter((nutri) => nutri.indented)
					.map((nutri, i) => {
						return (
							<NutritionItem
								nutrition={nutri}
								key={`nutri ${i}`}
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
