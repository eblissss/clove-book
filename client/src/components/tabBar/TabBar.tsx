import React from "react";
import { Link as RouterLink } from "react-router-dom";

import { Box, Button, CardMedia, IconButton, Typography } from "@mui/material";
import TabIcon from "./TabIcon";
import { AccountBox as AccIcon } from "@mui/icons-material";

import { doLogout } from "../../api/requests";

import cloveImg from "../../assets/cloveB.png";

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
				textAlign: "center",
			}}
		>
			<TabIcon />
			<Typography
				sx={{
					position: "relative",
					top: "25%",
					color: "primary.contrastText",
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
				display: "flex",
				justifyContent: "left",
				top: "0px",
				width: "100%",
				height: "59px",
				backgroundColor: "primary.main",
				whiteSpace: "nowrap",
				overflow: "hidden",
			}}
		>
			<Button
				component={RouterLink}
				to="/home"
				sx={{
					height: "59px",
				}}
			>
				<CardMedia
					image={cloveImg}
					sx={{ height: "59px", width: "135px" }}
				/>
			</Button>
			<OneTab tab="home" selectedTab={props.tab} />
			<OneTab tab="saved" selectedTab={props.tab} />
			<OneTab tab="create" selectedTab={props.tab} />

			<IconButton
				component={RouterLink}
				to="/user"
				sx={{ marginLeft: "auto", mr: "1rem" }}
			>
				<AccIcon sx={{ fontSize: "43px" }} />
			</IconButton>
			<Button
				component={RouterLink}
				to="/"
				className="Logout"
				sx={{
					top: "calc((59px - 70%) / 2)",
					width: "100px",
					height: "70%",
					mr: "12px",
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
