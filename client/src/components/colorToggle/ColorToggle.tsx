import { Box, IconButton, PaletteMode } from "@mui/material";
import {
	Brightness4 as Brightness4Icon,
	Brightness7 as Brightness7Icon,
} from "@mui/icons-material";
import React from "react";

interface toggleProps {
	toggle: () => void;
	mode: PaletteMode;
}
//  onClick={toggle}
function ColorToggle({ toggle, mode }: toggleProps) {
	return (
		<Box
			component="div"
			sx={{
				position: "fixed",
				width: "50px",
				alignItems: "center",
				justifyContent: "center",
				color: "text.primary",
				bottom: 0,
				left: 0,
			}}
		>
			<IconButton onClick={toggle}>
				{mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
			</IconButton>
		</Box>
	);
}

export default ColorToggle;
