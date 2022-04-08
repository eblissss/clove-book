import { Box } from "@mui/material";
import React from "react";

interface tagProps {
	onClick?: React.MouseEventHandler<HTMLDivElement>;
	name: string;
	props?: any;
}

function Tag({ onClick, name, props }: tagProps) {
	return (
		<Box
			key={name}
			component="div"
			sx={{
				display: "flex",
				color: "secondary.lightContrastText",
				backgroundColor: "secondary.main",
				height: "30px",
				borderRadius: "5px",
				p: "6px",
				m: "6px",
				ml: "0px",
				alignItems: "center",
				...props,
			}}
			onClick={onClick}
		>
			{name}
		</Box>
	);
}

export default Tag;
