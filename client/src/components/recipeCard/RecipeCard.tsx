import {
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	CardMedia,
	Grid,
	Typography,
} from "@mui/material";
import React from "react";

interface cardProps {
	name: string;
	imageURL?: string;
	tags?: string[];
	cookTime?: string;
	boxProps?: any;
}

export function RecipeCard(props: cardProps) {
	return (
		<Card
			sx={{
				// height: "300px",
				width: "240px",
				display: "flex",
				flexDirection: "column",
				borderRadius: "20px",
				backgroundColor: "primary.dark",
				...props.boxProps,
			}}
		>
			<CardMedia
				component="img"
				sx={{
					height: "200px",
					pt: "56.25",
				}}
				image={
					props.imageURL
						? props.imageURL
						: "https://source.unsplash.com/random"
				}
				alt="food image"
			/>
			<CardContent sx={{ flexGrow: 1 }}>
				<Typography
					gutterBottom
					variant="h5"
					component="h3"
					sx={{
						color: "primary.contrastText",
					}}
				>
					{props.name}
				</Typography>
				<Box
					component="div"
					sx={{
						display: "flex",
						flexWrap: "wrap",
					}}
				>
					{props.tags?.map((tag) => (
						<Box
							key="tag"
							component="div"
							sx={{
								display: "flex",
								color: "white",
								backgroundColor: "green",
								height: "30px",
								borderRadius: "5px",
								p: "5px",
								m: "5px",
								justifyContent: "center",
							}}
						>
							{tag}
						</Box>
					))}
				</Box>
			</CardContent>
			<CardActions>
				<Button size="small">View</Button>
				<Button size="small">Edit</Button>
			</CardActions>
		</Card>
	);
}
