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
				color: "secondary.contrastText",
				backgroundColor: "secondary.dark",
				height: "30px",
				borderRadius: "5px",
				p: "5px",
				m: "5px",
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
