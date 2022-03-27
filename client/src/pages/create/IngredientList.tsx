import { Box, Container, List, TextField, Typography } from "@mui/material";
import {
	AddCircle as AddCircleIcon,
	RemoveCircle as RemoveCircleIcon,
} from "@mui/icons-material";
import React, { useState } from "react";

interface stringIng {
	name: string;
	amount: string;
	unit: string;
}

function IngredientItem({
	data,
	id,
	added,
	doDel,
	addIng,
	update,
}: {
	data?: stringIng;
	id: number;
	added: boolean;
	doDel: Function;
	addIng?: Function;
	update?: Function;
}) {
	const newIng: React.ChangeEventHandler<
		HTMLInputElement | HTMLTextAreaElement
	> = (e: any) => {
		addIng!(e.target.value);
		e.target.value = "";
	};

	return (
		<Container
			disableGutters
			sx={{ display: "flex", alignItems: "center" }}
		>
			{added ? (
				<RemoveCircleIcon
					sx={{ color: "primary.dark", fontSize: "32px" }}
					onClick={() => {
						doDel(id);
					}}
				/>
			) : (
				<AddCircleIcon
					sx={{ color: "primary.dark", fontSize: "32px" }}
				/>
			)}
			<Container disableGutters sx={{ flex: 4, px: "10px" }}>
				<TextField
					autoFocus
					fullWidth
					id={`ingredient-${id}`}
					className="recipeInput"
					placeholder="New Ingredient"
					onChange={
						added
							? (e) => {
									update!(e.target.value, id, "name");
							  }
							: newIng
					}
					value={data?.name}
				></TextField>
			</Container>
			<Container disableGutters sx={{ flex: 1, pl: "20px", pr: "5px" }}>
				<TextField
					id={`ingredientAmount-${id}`}
					className="recipeInput"
					placeholder="Amt"
				></TextField>
			</Container>
			<Container disableGutters sx={{ flex: 1, px: "10px" }}>
				<TextField
					id={`ingredientUnit-${id}`}
					className="recipeInput"
					placeholder="Unit"
				></TextField>
			</Container>
		</Container>
	);
}

function IngredientList() {
	const [ingList, setIngList] = useState<stringIng[]>([]);

	const doDelete = (toDel: number) => {
		const newList = [...ingList];
		newList!.splice(toDel, 1);
		setIngList(newList);
	};

	const addIngredient = (temp: string) => {
		const tempIng: stringIng = { name: temp, amount: "", unit: "" };
		setIngList([...ingList, tempIng]);
	};

	const updateIngredient = (value: string, id: number, slot: string) => {
		const newList = [...ingList];
		switch (slot) {
			case "name":
				newList[id].name = value;
				break;
			case "amount":
				newList[id].amount = value;
				break;
			case "unit":
				newList[id].unit = value;
				break;
			default:
				break;
		}
		setIngList(newList);
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
				Ingredients:
			</Typography>
			<List>
				{ingList?.map((ing, i) => {
					console.log(i, ing);
					return (
						<IngredientItem
							key={`ing-${i}`}
							data={ing}
							added={true}
							id={i}
							doDel={doDelete}
							update={updateIngredient}
						/>
					);
				})}
				<IngredientItem
					added={false}
					id={-1}
					doDel={doDelete}
					addIng={addIngredient}
				/>
			</List>
		</Box>
	);
}

export default IngredientList;
