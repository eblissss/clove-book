import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import { green, red } from "@mui/material/colors";

declare module "@mui/material/styles" {
	interface Palette {
		tertiary: Palette["primary"];
	}

	interface PaletteOptions {
		tertiary: PaletteOptions["primary"];
	}
}

const palette = {
	primary: {
		main: "#c8c1bd",
		light: "#fbf4ef",
		dark: "#97918d",
		contrastText: "#000000",
	},
	secondary: {
		main: green[300],
		light: green[100],
		dark: green[500],
		contrastText: "#ffffff",
	},
	tertiary: {
		main: "#8bcece",
	},
	error: {
		main: red.A400,
	},
	contrastThreshold: 3,
	tonalOffset: 0.2,
};

const theme = createTheme({
	palette: {
		...palette,
	},
	components: {
		MuiButton: {
			styleOverrides: {
				root: {
					"&.Logout": {
						"&:hover": {
							backgroundColor: palette.secondary.dark,
						},
					},
					"&.Translucent": {
						opacity: "50%",
						"&:hover": {
							opacity: "70%",
						},
					},
					"&.Submit:hover": {
						backgroundColor: palette.tertiary.main,
						boxShadow: "rgba(0, 0, 0, 0.15) 0 3px 9px 0",
						transform: "translateY(-2px)",
					},
				},
			},
		},
		MuiTextField: {
			styleOverrides: {
				root: {
					"&.Round": {
						border: "0px solid",
						borderColor: "primary.main",
						// overflow: "hidden",
						borderRadius: "100px",
						backgroundColor: "#ffffff",
						boxSizing: "border-box",

						// "& label": {
						// 	color: "primary.main",
						// 	border: "0px",
						// },
						// "& label.Mui-focused": {
						// 	color: "secondary.main",
						// },
						// "& .MuiInput-underline:after": {
						// 	borderBottomColor: "primary.main",
						// },
						"& .MuiOutlinedInput-root": {
							"& fieldset": {
								color: "#ffffff",
								border: "none",
								// borderColor: "primary.main",
								borderRadius: "100px",
								paddingLeft: "0.5rem",
								margin: "-0.05rem",
							},
							"&:hover fieldset": {
								border: "1px solid",
								// borderColor: "primary.main",
								borderWidth: "0.15rem",
							},
							"&:Mui-focused fieldset": {
								border: "1px solid",
								// borderColor: "primary.main",
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
