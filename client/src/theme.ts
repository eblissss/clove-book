import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import { red } from "@mui/material/colors";
import WebFont from "webfontloader";

WebFont.load({
	google: {
		families: ["Overlock", "Prociono", "Sen"],
	},
});

declare module "@mui/material/styles" {
	interface Palette {
		tertiary: Palette["primary"];
	}

	interface PaletteOptions {
		tertiary: PaletteOptions["primary"];
	}

	interface PaletteColor {
		darkContrastText?: string;
	}

	interface SimplePaletteColorOptions {
		darkContrastText?: string;
	}
}

const palette = {
	primary: {
		main: "#c8c1bd",
		light: "#fbf4ef",
		dark: "#97918d",
		contrastText: "#000000",
		darkContrastText: "#ffffff",
	},
	secondary: {
		main: "#AB98C7",
		light: "#d6cde4",
		dark: "#6c5095",
		contrastText: "#ffffff",
	},
	tertiary: {
		main: "#5C6573",
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
		MuiListItem: {
			styleOverrides: {
				root: {
					"& .MuiListItemButton-root": {
						padding: "0 0.4rem",
					},
				},
			},
		},
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
					"&.Classic": {
						backgroundColor: palette.secondary.main,
						borderRadius: "17px",
						color: palette.secondary.contrastText,
						fontSize: "1.2rem",
						textAlign: "center",
						transition: "transform 300ms ease",
						"&:hover": {
							backgroundColor: palette.secondary.dark,
							transform: "translateY(-3px)",
						},
					},
					"&.Submit": {
						borderRadius: "100px",
						margin: "20px auto",
						backgroundColor: palette.secondary.main,
						boxShadow: "rgba(0, 0, 0, 0.1) 0 2px 4px 0",
						color: palette.secondary.contrastText,
						fontFamily: [
							"sans-serif",
							"Akzidenz Grotesk BQ Medium",
						],
						fontSize: "16px",
						padding: "10px 25px",
						transition: "transform 150ms, box-shadow 150ms",
						"&:hover": {
							backgroundColor: palette.secondary.main,
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
						},
					},
					"&.recipeInput": {
						border: `0px solid`,
						borderRadius: "8px",
						backgroundColor: palette.primary.dark,
						boxSizing: "border-box",
						margin: "5px auto",
						"& .MuiInputBase-root": {
							"& input": {
								color: palette.primary.darkContrastText,
								height: "0px",
								fontFamily: ["Sen"],
								fontSize: "18px",
								fontWeight: 700,
							},
							"& textarea": {
								color: palette.primary.darkContrastText,
								height: "0px",
								fontFamily: ["Sen"],
								fontSize: "18px",
								fontWeight: 700,
							},
							"& fieldset": {
								border: "none",
								borderRadius: "8px",
								paddingLeft: "0.5rem",
								margin: "-0.05rem",
							},
							"&:hover fieldset": {
								border: `1px solid ${palette.primary.dark}`,
								borderWidth: "0.15rem",
							},
							"&.Mui-focused fieldset": {
								border: `1px solid ${palette.primary.light}`,
								borderWidth: "0.15rem",
							},
						},
					},
					"&.Round": {
						border: "0px solid",
						borderColor: palette.primary.main,
						borderRadius: "100px",
						backgroundColor: "#ffffff",
						boxSizing: "border-box",
						margin: "5px auto",

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
