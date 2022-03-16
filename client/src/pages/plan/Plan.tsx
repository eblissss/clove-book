import { Box, Container } from "@mui/material";
import React from "react";

import { TabBar } from "../../components/tabBar/TabBar";

function Plan() {
	return (
		<Box
			component="div"
			sx={{
				backgroundColor: "primary.light",
			}}
		>
			<TabBar tab="plan" />
			<Container
				id="BACKGROUND"
				sx={{
					p: "30px",
					display: "flex",
				}}
			></Container>
		</Box>
	);
}

export default Plan;
