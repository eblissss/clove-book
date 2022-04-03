import { Box, Container, List, TextField, Typography } from "@mui/material";
import {
	AddCircle as AddCircleIcon,
	RemoveCircle as RemoveCircleIcon,
} from "@mui/icons-material";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setInstructions } from "./creationSlice";
import { Instruction } from "../../api/models";

function StepItem({
	data,
	id,
	added,
	doDel,
	addStep,
	update,
	autoFocus,
}: {
	data?: Instruction;
	id: number;
	added: boolean;
	doDel: Function;
	addStep?: Function;
	update?: Function;
	autoFocus?: boolean;
}) {
	const newStep: React.ChangeEventHandler<
		HTMLInputElement | HTMLTextAreaElement
	> = (e: any) => {
		addStep!(e.target);
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
					autoFocus={autoFocus}
					fullWidth
					id={`step-${id}`}
					className="recipeInput"
					placeholder="Add a new step"
					onChange={
						added
							? (e) => {
									update!(e.target.value, id);
							  }
							: newStep
					}
					value={data?.description}
				></TextField>
			</Container>
		</Container>
	);
}

function StepList() {
	const dispatch = useDispatch();

	const [stepList, setStepList] = useState<Instruction[]>([]);

	const doDelete = (toDel: number) => {
		const newList = [...stepList];
		newList!.splice(toDel, 1);
		setStepList(newList);
	};

	const addStep = (target: any) => {
		setStepList([...stepList, { description: target.value }]);
	};

	const updateStep = (value: string, id: number) => {
		const newList = [...stepList];
		newList[id].description = value;
		setStepList(newList);
	};

	const saveInstructions = () => {
		dispatch(setInstructions(stepList));
	};
	document
		.getElementById("createSubmit")
		?.addEventListener("click", saveInstructions);

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
							autoFocus={i + 1 === stepList.length}
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
