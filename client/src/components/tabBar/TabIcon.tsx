import React from "react";
import { SvgIcon, SvgIconProps } from "@mui/material";

function TabIcon(props: SvgIconProps) {
	return (
		<SvgIcon
			viewBox="0 0 439 106"
			sx={{
				color: "primary.light",
				position: "absolute",
				width: "100%",
				height: "100%",
				maxHeight: "80%",
				bottom: "0px",
				left: 0,
			}}
		>
			<path d="M439 105.5H-3.05176e-05C86.5 68.5 45 0.000305176 103 0.000305176H329.5C388.5 0.000244141 358 68.5 439 105.5Z" />
		</SvgIcon>
	);
}

TabIcon.displayName = "TabIcon";
TabIcon.muiName = "SvgIcon";

export default TabIcon;
