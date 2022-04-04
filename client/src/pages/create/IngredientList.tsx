import { Box, Container, List, TextField, Typography } from "@mui/material";
import {
	AddCircle as AddCircleIcon,
	RemoveCircle as RemoveCircleIcon,
} from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { selectCreation, setIngredients } from "./creationSlice";
import { Ingredient } from "../../api/models";
import { useAppSelector } from "../../app/hooks";

interface IngStr {
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
	autoSelect,
}: {
	data?: IngStr;
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

	const [ingStrList, setIngStrList] = useState<IngStr[]>([]);

	const reduxIngredients = useAppSelector(selectCreation).ingredients;
	useEffect(() => {
		const tempIngStrList: IngStr[] = [];
		reduxIngredients.forEach((ing) => {
			tempIngStrList.push({
				name: ing.name,
				amount: "" + ing.amount,
				unit: ing.unit,
			});
		});
		setIngStrList(tempIngStrList);
	}, [reduxIngredients]);

	const doDelete = (toDel: number) => {
		const newList = [...ingStrList];
		newList!.splice(toDel, 1);
		setIngStrList(newList);
	};

	const addIngredient = (target: any) => {
		const tempIng: IngStr = { name: "", amount: "", unit: "" };
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
		setIngStrList([...ingStrList, tempIng]);
	};

	const updateIngredient = (value: string, id: number, slot: string) => {
		const newList = [...ingStrList];
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
		setIngStrList(newList);
	};

	const saveIngredients = () => {
		const ingList: Ingredient[] = [];
		ingStrList.forEach((ing) => {
			ingList.push({
				name: ing.name,
				amount: parseInt(ing.amount),
				unit: ing.unit,
			});
		});
		dispatch(setIngredients(ingList));
	};
	document
		.getElementById("createSubmit")
		?.addEventListener("click", saveIngredients);

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
				{ingStrList?.map((ing, i) => {
					return (
						<IngredientItem
							key={`ing-${i}`}
							data={ing}
							added={true}
							id={i}
							doDel={doDelete}
							update={updateIngredient}
							autoSelect={
								i + 1 === ingStrList.length ? autoSelect : ""
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
