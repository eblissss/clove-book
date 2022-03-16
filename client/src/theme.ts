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
		contrastText: "#fff",
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
		MuiTypography: {
			styleOverrides: {
				root: {
					fontFamily: ["Sen"],
					color: palette.primary.contrastText,
				},
			},
		},
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
					"&.Submit": {
						borderRadius: "100px",
						margin: "20px auto",
						backgroundColor: palette.tertiary.main,
						boxShadow: "rgba(0, 0, 0, 0.1) 0 2px 4px 0",
						color: palette.tertiary.contrastText,
						fontFamily: [
							"sans-serif",
							"Akzidenz Grotesk BQ Medium",
						],
						fontSize: "16px",
						padding: "10px 25px",
						transition: "transform 150ms, box-shadow 150ms",
						"&:hover": {
							backgroundColor: palette.tertiary.main,
							boxShadow: "rgba(0, 0, 0, 0.15) 0 3px 9px 0",
							transform: "translateY(-2px)",
						},
					},
				},
			},
		},
		MuiTextField: {
			styleOverrides: {
				root: {
					"& .MuiInputBase-multiline": {
						"&.MuiFilledInput-underline:before": {
							borderBottom: `0px solid ${palette.primary.main}`,
						},
						"&.MuiFilledInput-underline:hover:before": {
							borderBottom: `0px solid ${palette.primary.dark}`,
						},
						"&.MuiFilledInput-underline:after": {
							borderBottom: `3px solid ${palette.primary.dark}`,
						},
						padding: "10px 12px",
						borderRadius: "15px",
						backgroundColor: palette.primary.dark,
						"& .MuiInputBase-inputMultiline": {
							fontSize: 16,
							borderRadius: "15px",
						},
					},
					"&.Round": {
						border: "0px solid",
						borderColor: "primary.main",
						borderRadius: "100px",
						backgroundColor: "#ffffff",
						boxSizing: "border-box",
						margin: "10px auto",

						"& .MuiOutlinedInput-root": {
							"& fieldset": {
								color: "#ffffff",
								border: "none",
								borderRadius: "100px",
								paddingLeft: "0.5rem",
								margin: "-0.05rem",
							},
							"&:hover fieldset": {
								border: "1px solid",
								borderWidth: "0.15rem",
							},
							"&:Mui-focused fieldset": {
								border: "1px solid",
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
