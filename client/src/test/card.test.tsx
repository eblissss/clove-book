import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../app/store";
import { RecipeCard } from "../components/recipeCard/RecipeCard";
import { fakeJSON } from "../api/models";

test("card loads and displays image", async () => {
	render(
		<Provider store={store}>
			<RecipeCard {...fakeJSON} />
		</Provider>
	);

	fireEvent.click(screen.getByRole("img", { name: "food image" }));

	await waitFor(() => screen.getByRole("img", { name: "food image" }));

	expect(screen.getByRole("img", { name: "food image" })).toBeInTheDocument();
});

test("card loads and displays tag", async () => {
	render(
		<Provider store={store}>
			<RecipeCard {...fakeJSON} />
		</Provider>
	);

	fireEvent.click(screen.getByText("grass"));

	await waitFor(() => fireEvent.click(screen.getByText("grass")));

	expect(screen.getByText("grass")).toBeInTheDocument();
});

test("card loads and displays time", async () => {
	render(
		<Provider store={store}>
			<RecipeCard {...fakeJSON} />
		</Provider>
	);

	fireEvent.click(screen.getByText("10m"));

	await waitFor(() => fireEvent.click(screen.getByText("10m")));

	expect(screen.getByText("10m")).toBeInTheDocument();
});
