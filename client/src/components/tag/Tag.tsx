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
				width: "auto",
				fontFamily: ["sans-serif", "Poppins"],
				color: "secondary.lightYellow",
				backgroundColor: "secondary.dark",
				borderRadius: "5px",
				height: "30px",

				p: "6px",
				m: "6px",
				ml: "0px",
				alignItems: "center",
				...props,
			}}
			onClick={onClick}
		>
			{name.replace(/\s/g, "\u00A0")}
		</Box>
	);
}

export default Tag;
