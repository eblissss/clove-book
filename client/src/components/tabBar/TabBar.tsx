import React from "react";
import { Link as RouterLink } from "react-router-dom";

import { Box, Button, Typography } from "@mui/material";
import TabIcon from "./TabIcon";

import { doLogout } from "../../api/requests";

interface tabProps {
	tab: string;
	selectedTab?: string;
}

function OneTab(props: tabProps) {
	return (
		<Button
			component={RouterLink}
			to={`/${props.tab}`}
			className={props.selectedTab === props.tab ? "" : "Translucent"}
			sx={{
				display: "inline-block",
				width: "200px",
				height: "100%",
				transform: "translateX(40px)",
				textAlign: "center",
			}}
		>
			<TabIcon />
			<Typography
				sx={{
					position: "relative",
					top: "25%",
					color: "primary.contrastText",
					fontFamily: [
						"sans-serif",
						"Trebuchet MS",
						"Calibri",
						"Gill Sans MT",
						"Gill Sans",
					],
					fontSize: "1.4rem",
				}}
			>
				{props.tab.toUpperCase()}
			</Typography>
		</Button>
	);
}

export function TabBar(props: tabProps) {
	return (
		<Box
			component="div"
			sx={{
				position: "relative",
				top: "0px",
				width: "100%",
				height: "59px",
				backgroundColor: "primary.main",
				whiteSpace: "nowrap",
				overflow: "hidden",
			}}
		>
			<OneTab tab="home" selectedTab={props.tab} />
			<OneTab tab="saved" selectedTab={props.tab} />
			<OneTab tab="plan" selectedTab={props.tab} />
			<OneTab tab="create" selectedTab={props.tab} />
			<Button
				component={RouterLink}
				to="/"
				className="Logout"
				sx={{
					position: "absolute",
					top: "calc((60px - 70%) / 2)",
					right: "20px",
					width: "100px",
					height: "70%",
					backgroundColor: "secondary.main",
					borderRadius: "17px",
					color: "secondary.contrastText",
					fontSize: "1.1rem",
					textAlign: "center",
				}}
				onClick={doLogout}
			>
				Logout
			</Button>
		</Box>
	);
}
