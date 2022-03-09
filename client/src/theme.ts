import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import { red } from "@mui/material/colors";

const theme = createTheme({
	palette: {
		primary: {
			main: "#556cd6",
		},
		secondary: {
			main: "#19857b",
		},
		error: {
			main: red.A400,
		},
	},
	components: {
		MuiTextField: {
			styleOverrides: {
				root: {
					"&.Round": {
						border: "0px solid",
						borderColor: "#3E68A8",
						// overflow: "hidden",
						borderRadius: "100px",
						backgroundColor: "#ffffff",
						boxSizing: "border-box",

						"& label": {
							color: "#3E68A8",
							border: "0px",
						},
						"& label.Mui-focused": {
							color: "#AE68A8",
						},
						"& .MuiInput-underline:after": {
							borderBottomColor: "#3E68A8",
						},
						"& .MuiOutlinedInput-root": {
							"& fieldset": {
								color: "#ffffff",
								border: "none",
								borderColor: "#3E68A8",
								borderRadius: "100px",
								paddingLeft: "0.5rem",
								margin: "-0.05rem",
							},
							"&:hover fieldset": {
								border: "1px solid",
								borderColor: "#3E68A8",
								borderWidth: "0.15rem",
							},
							"&:Mui-focused fieldset": {
								border: "1px solid",
								borderColor: "#3E68A8",
							},
						},
					},
				},
			},
		},
		MuiFormHelperText: {
			styleOverrides: {
				root: {
					textTransform: "initial",
					fontSize: "1rem",
				},
			},
		},
	},
});

export default responsiveFontSizes(theme);
