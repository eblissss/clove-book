import { Box, Container, List, TextField, Typography } from "@mui/material";
import {
	AddCircle as AddCircleIcon,
	RemoveCircle as RemoveCircleIcon,
} from "@mui/icons-material";
import React, { useState } from "react";
import { useDispatch } from "react-redux";

function StepItem({
	data,
	id,
	added,
	doDel,
	addStep,
	update,
}: {
	data?: string;
	id: number;
	added: boolean;
	doDel: Function;
	addStep?: Function;
	update?: Function;
}) {
	const newStep: React.ChangeEventHandler<
		HTMLInputElement | HTMLTextAreaElement
	> = (e: any) => {
		addStep!(e.target.value);
		e.target.value = "";
	};

	const spawnStep = (e: any) => {
		addStep!("");
	};

	return (
		<Container disableGutters sx={{ display: "flex", alignItems: "top" }}>
			{added ? (
				<RemoveCircleIcon
					sx={{ color: "primary.dark", fontSize: "32px", mt: "10px" }}
					onClick={() => {
						doDel(id);
					}}
				/>
			) : (
				<AddCircleIcon
					sx={{ color: "primary.dark", fontSize: "32px", mt: "10px" }}
					onClick={spawnStep}
				/>
			)}
			<Container disableGutters sx={{ flex: 4, px: "10px" }}>
				<TextField
					autoFocus
					fullWidth
					id={`step-${id}`}
					className="recipeInput"
					placeholder="Add a new step"
					multiline
					onChange={
						added
							? (e) => {
									update!(e.target.value, id, "name");
							  }
							: newStep
					}
					value={data}
				></TextField>
			</Container>
		</Container>
	);
}

function StepList() {
	const dispatch = useDispatch();

	const [stepList, setStepList] = useState<string[]>([]);

	const doDelete = (toDel: number) => {
		const newList = [...stepList];
		newList!.splice(toDel, 1);
		setStepList(newList);
	};

	const addStep = (temp: string) => {
		setStepList([...stepList, temp]);
	};

	const updateStep = (value: string, id: number) => {
		const newList = [...stepList];
		newList[id] = value;
		dispatch(newList);
		setStepList(newList);
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
				Recipe Steps:
			</Typography>
			<List>
				{stepList?.map((step, i) => {
					console.log(i, step);
					return (
						<StepItem
							key={`step-${i}`}
							data={step}
							added={true}
							id={i}
							doDel={doDelete}
							update={updateStep}
						/>
					);
				})}
				<StepItem
					added={false}
					id={-1}
					doDel={doDelete}
					addStep={addStep}
				/>
			</List>
		</Box>
	);
}

export default StepList;
