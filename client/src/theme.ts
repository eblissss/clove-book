import React from "react";
import { alpha, createTheme, responsiveFontSizes } from "@mui/material/styles";
import WebFont from "webfontloader";
import { PaletteMode } from "@mui/material";

WebFont.load({
	google: {
		families: [
			"Overlock",
			"Sen",
			"Libre Baskerville",
			"DM Serif Text",
			"Fugaz One",
			"Sorts Mill Goudy",
			"Poppins",
		],
	},
});

declare module "@mui/material/styles" {
	interface PaletteColor {
		darkContrastText?: string;
	}

	interface SimplePaletteColorOptions {
		darkContrastText?: string;
	}
}
/*
#f5efde
##aa9c8c 
Dark Beige #695540 
Darker 
#4f3c2f

Dark Background Logo Clove: (yellow) #FACF50 
Dark Background: #82916B (green)
Dark Background Logo Text: (see light beige)

Clove Light Background Logo Text: (same as dark background)#82916B
Light Background Clove: (orange) #E5932A 


*/

function randomColor() {
	return "#" + Math.floor(Math.random() * 0xffffff).toString(16);
}

export const palette = {
	primary: {
		main: "#E2DFD4",
		light: "#FAF4EB",
		dark: "#73825D",
		darker: "#435643",
		// On light backgrounds, use lightContrastText, otherwise use contrastText
		lightContrastText: "#303020",
		contrastText: "#FAF4EB",
	},
	secondary: {
		main: "#E5932A", // Green
		dark: "#bb6d28",
		yellow: "#FACF50",
		lightYellow: "#ffe186",
		moss: "#82916B",
		lightContrastText: "#302430",
		contrastText: "#ffffff",
	},
	error: {
		main: "#EE733C",
	},
	contrastThreshold: 3,
	tonalOffset: 0.2,
};

export const darkPalette = {
	primary: {
		main: randomColor(),
		light: randomColor(),
		dark: randomColor(),
		darker: randomColor(),
		// On light backgrounds, use lightContrastText, otherwise use contrastText
		lightContrastText: randomColor(),
		contrastText: randomColor(),
	},
	secondary: {
		main: randomColor(), // Green
		dark: randomColor(),
		yellow: randomColor(),
		moss: randomColor(),
		lightContrastText: randomColor(),
		contrastText: randomColor(),
	},
	error: {
		main: randomColor(),
	},
	contrastThreshold: 3,
	tonalOffset: 0.2,
};

const getDesignToken = (mode: PaletteMode) =>
	mode === "light" ? palette : darkPalette;

const theme = (mode: PaletteMode) =>
	createTheme({
		palette: {
			...getDesignToken(mode),
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
			MuiContainer: {
				styleOverrides: {
					root: {
						"&.AlphaDark": {
							backgroundColor: alpha(palette.primary.dark, 0.7),
						},
					},
				},
			},
			MuiCardContent: {
				styleOverrides: {
					root: {
						"&:last-child": {
							paddingBottom: "10px",
						},
					},
				},
			},
			MuiTypography: {
				styleOverrides: {
					root: {
						fontFamily: ["sans-serif", "Poppins", "Poppins"],
						position: "relative",
						overflowWrap: "break-word",
						hyphens: "auto",
						"&.Title": {
							fontFamily: [
								"sans-serif",
								"Poppins",
								"DM Serif Text",
							],
							// fontWeight: "bold",

							color: palette.primary.contrastText,
						},
						"&.BigTitle": {
							fontFamily: [
								"sans-serif",
								"Poppins",
								"DM Serif Text",
							],
							// fontWeight: "bold",

						"&:hover": {
							backgroundColor: palette.primary.darker,
							boxShadow: "rgba(0, 0, 0, 0.15) 0 3px 9px 0",
							transform: "translateY(-2px)",
							color: palette.primary.lightContrastText,
						},
					},
				},
			},
			MuiIconButton: {
				styleOverrides: {
					root: {
						position: "relative",
						zIndex: "tooltip",
						"&.Menu": {
							// height: "64px",
							// width: "64px",
							borderRadius: "0px",
							border: "unset",
							margin: "0px",
							"& svg": {
								fontSize: "2.5rem",
							},
							"&:hover, &.Mui-focusVisible": {
								backgroundColor: "transparent",
							},
						},
					},
				},
			},
			MuiCheckbox: {
				styleOverrides: {
					root: {
						"&.Mui-checked": {
							color: getDesignToken(mode).primary
								.lightContrastText,
						},
					},
				},
			},
			MuiButton: {
				styleOverrides: {
					root: {
						fontFamily: ["sans-serif", "Poppins"],
						fontWeight: "bold",
						"&.Logout": {
							"&:hover": {
								backgroundColor:
									getDesignToken(mode).secondary.main,
							},
						},
						"&.OnLight": {
							backgroundColor: getDesignToken(mode).primary.dark,
							color: getDesignToken(mode).primary.contrastText,
							textAlign: "center",
							borderRadius: "100px",
							margin: "10px auto",
							boxShadow: "rgba(0, 0, 0, 0.1) 0 2px 4px 0",

							"&:hover": {
								backgroundColor:
									getDesignToken(mode).primary.main,
								boxShadow: "rgba(0, 0, 0, 0.15) 0 3px 9px 0",
								transform: "translateY(-2px)",
							},
						},
						"&.Classic": {
							backgroundColor:
								getDesignToken(mode).secondary.main,
							borderRadius: "17px",
							color: getDesignToken(mode).secondary
								.lightContrastText,
							fontSize: "1.3rem",
							textAlign: "center",
							transition: "transform 150ms, box-shadow 150ms",
							"&:hover": {
								backgroundColor:
									getDesignToken(mode).secondary.moss,
								color: getDesignToken(mode).secondary.yellow,
								boxShadow: "rgba(0, 0, 0, 0.15) 0 3px 9px 0",
								transform: "translateY(-2px)",
							},
						},
						"&.Submit": {
							borderRadius: "50px",
							margin: "10px auto",
							backgroundColor:
								getDesignToken(mode).secondary.main,
							boxShadow: "rgba(0, 0, 0, 0.1) 0 2px 4px 0",
							color: getDesignToken(mode).secondary.contrastText,
							fontFamily: [
								"-apple-system",
								'"Segoe UI"',
								"Akzidenz Grotesk BQ Medium",
								"sans-serif",
								"Sen",
							],
							fontSize: "16px",
							padding: "10px 25px",
							transition: "transform 150ms, box-shadow 150ms",
							"&:hover": {
								backgroundColor:
									getDesignToken(mode).secondary.dark,
								color: getDesignToken(mode).secondary.yellow,
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
						width: "100%",
						"& .MuiInputBase-multiline": {
							padding: "10px 12px",
							borderRadius: "15px",
							backgroundColor: getDesignToken(mode).primary.dark,
							"&.Mui-focused": {
								backgroundColor:
									getDesignToken(mode).primary.dark,
							},
							"& .MuiInputBase-inputMultiline": {
								fontSize: 16,
								color: getDesignToken(mode).primary
									.contrastText,
							},
							"&.MuiFilledInput-underline:before": {
								borderBottom: `0px solid ${
									getDesignToken(mode).primary.main
								}`,
							},
							"&.MuiFilledInput-underline:hover:before": {
								borderBottom: `0px solid ${
									getDesignToken(mode).primary.dark
								}`,
							},
							"&.MuiFilledInput-underline:after": {
								borderBottom: `0px solid ${
									getDesignToken(mode).primary.dark
								}`,
							},
						},
						"&.blockLabels": {
							fontSize: 28,
							height: "auto",
							paddingTop: 3,
						},
						"&.recipeInput": {
							border: `0px solid`,
							borderRadius: "8px",
							backgroundColor: getDesignToken(mode).primary.dark,
							boxSizing: "border-box",
							margin: "5px",
							mx: "5px",
							"& .MuiInputBase-root": {
								"& input": {
									color: getDesignToken(mode).primary
										.contrastText,
									height: "0px",
									fontFamily: ["Sen"],
									fontSize: "18px",
									fontWeight: 700,
								},
								"& textarea": {
									color: getDesignToken(mode).primary
										.contrastText,
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
									border: `1px solid ${
										getDesignToken(mode).primary.dark
									}`,
									borderWidth: "0.15rem",
								},
								"&.Mui-focused fieldset": {
									border: `1px solid ${
										getDesignToken(mode).primary.light
									}`,
									borderWidth: "0.15rem",
								},
							},
						},
						"&.Round": {
							border: "0px solid",
							borderColor: getDesignToken(mode).primary.main,
							boxSizing: "border-box",
							margin: "5px",
							mx: "5px",
							"& .MuiOutlinedInput-root": {
								required: "true",
								backgroundColor: "#ffffff",
								borderRadius: "10px",
								"& input": {
									fontFamily: ["sans-serif", "Poppins"],
								},
								"& fieldset": {
									color: "#ffffff",
									border: "none",
									borderRadius: "100px",
									paddingLeft: "0.5rem",
									margin: "10px",
								},
								"&:hover fieldset": {
									border: "1px solid",
									borderWidth: "0.15rem",
								},
								"&:Mui-focused fieldset": {
									border: "1px solid",
								},
							},
							"& label": {
								fontFamily: ["sans-serif", "Poppins"],
							},
							"& p.Mui-error": {
								fontSize: "12px",
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
			MuiSvgIcon: {
				styleOverrides: {
					root: {
						"&.DarkOnHover:hover": {
							color: getDesignToken(mode).primary.darker,
						},
					},
				},
			},
		},
	});

const getTheme = (mode: PaletteMode) => responsiveFontSizes(theme(mode));

export default getTheme;
