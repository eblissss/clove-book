import { Box, Container } from "@mui/material";
import React from "react";

import { TabBar } from "../../components/tabBar/TabBar";

function Saved() {
	return (
		<Box
			component="div"
			sx={{
				backgroundColor: "primary.light",
			}}
		>
			<TabBar tab="saved" />
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

export default Saved;
