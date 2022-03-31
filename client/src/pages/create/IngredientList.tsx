import { Box, Container, List, TextField, Typography } from "@mui/material";
import {
	AddCircle as AddCircleIcon,
	RemoveCircle as RemoveCircleIcon,
} from "@mui/icons-material";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setIngredients } from "./creationSlice";
import { Ingredient } from "../../api/models";

function IngredientItem({
	data,
	id,
	added,
	doDel,
	addIng,
	update,
	autoSelect,
}: {
	data?: Ingredient;
	id: number;
	added: boolean;
	doDel: Function;
	addIng?: Function;
	update?: Function;
	autoSelect?: string;
}) {
	const newIng: React.ChangeEventHandler<
		HTMLInputElement | HTMLTextAreaElement
	> = (e: any) => {
		addIng!(e.target);
		e.target.value = "";
	};

	const spawnIng = (e: any) => {
		addIng!("");
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
					onClick={spawnIng}
				/>
			)}
			<Container disableGutters sx={{ flex: 4, px: "10px" }}>
				<TextField
					autoFocus={autoSelect === "name"}
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
					autoFocus={autoSelect === "amount"}
					id={`ingredientAmount-${id}`}
					className="recipeInput"
					placeholder="Amount"
					onChange={
						added
							? (e) => {
									update!(e.target.value, id, "amount");
							  }
							: newIng
					}
					value={data?.amount}
				></TextField>
			</Container>
			<Container disableGutters sx={{ flex: 1, px: "10px" }}>
				<TextField
					id={`ingredientUnit-${id}`}
					autoFocus={autoSelect === "unit"}
					className="recipeInput"
					placeholder="Unit"
					onChange={
						added
							? (e) => {
									update!(e.target.value, id, "unit");
							  }
							: newIng
					}
					value={data?.unit}
				></TextField>
			</Container>
		</Container>
	);
}

let autoSelect = "";
function IngredientList() {
	const dispatch = useDispatch();

	const [ingList, setIngList] = useState<Ingredient[]>([]);

	const doDelete = (toDel: number) => {
		const newList = [...ingList];
		newList!.splice(toDel, 1);
		setIngList(newList);
	};

	const addIngredient = (target: any) => {
		const tempIng: Ingredient = { name: "", amount: 0, unit: "" };
		switch (target.placeholder) {
			case "New Ingredient":
				tempIng.name = target.value;
				autoSelect = "name";
				break;
			case "Amount":
				tempIng.amount = target.value;
				autoSelect = "amount";
				break;
			case "Unit":
				tempIng.unit = target.value;
				autoSelect = "unit";
				break;
			default:
				break;
		}
		setIngList([...ingList, tempIng]);
	};

	const updateIngredient = (value: string, id: number, slot: string) => {
		const newList = [...ingList];
		switch (slot) {
			case "name":
				newList[id].name = value;
				break;
			case "amount":
				newList[id].amount = parseInt(value);
				break;
			case "unit":
				newList[id].unit = value;
				break;
			default:
				break;
		}
		dispatch(setIngredients(newList));
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
							autoSelect={
								i + 1 === ingList.length ? autoSelect : ""
							}
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
