import React from "react";

import { Box, Container, Grid, Typography } from "@mui/material";
import { TabBar } from "../../components/tabBar/TabBar";
import { RecipeCard } from "../../components/recipeCard/RecipeCard";

const fakeJSON = [
	{
		name: "Vegan Cheesecake",
		tags: ["cheesecake", "green"],
	},
	{
		name: "Vegan Cheesecake",
		tags: ["cheesecake", "green"],
	},
];
for (let i = 0; i < 12; i++) {
	fakeJSON.push({
		name: "Vegan Cheesecake",
		tags: ["cheesecake", "green"],
	});
}

function Home() {
	return (
		<>
			<TabBar tab="home" />
			<Box
				id="BACKGROUND"
				component="div"
				sx={{
					position: "absolute",
					minHeight: "calc(100vh - 59px)",
					width: "100vw",
					top: "59px",
					backgroundColor: "primary.light",
				}}
			>
				<Typography
					variant="h2"
					component="h2"
					sx={{
						color: "primary.contrastText",
						m: "20px",
						fontFamily: ["Sen"],
					}}
				>
					Explore New Recipes
				</Typography>
				<Container sx={{ py: 8, float: "left" }} maxWidth="md">
					<Grid container spacing={4}>
						{fakeJSON.map((recipe, i) => (
							<Grid item key={i} xs={12} sm={6} md={4}>
								<RecipeCard
									{...recipe}
									// boxProps={{ ml: `${50 * i}px`, mt: "50px" }}
								/>
							</Grid>
						))}
					</Grid>
				</Container>
			</Box>
		</>
	);
}

export default Home;
