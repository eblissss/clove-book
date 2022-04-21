import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../app/store";
import SearchBar from "../components/searchBar/SearchBar";
import SearchMenu from "../components/searchBar/SearchMenu";

test("loads and displays title", async () => {
	render(
		<Provider store={store}>
			<SearchBar searchFunc={() => {}} />
		</Provider>
	);

	await waitFor(() =>
		screen.getByPlaceholderText("A lentil dish with plenty of greens...")
	);

	expect(
		screen.getByPlaceholderText("A lentil dish with plenty of greens...")
	).toBeInTheDocument();
});

test("loads and displays menu", async () => {
	render(
		<Provider store={store}>
			<SearchMenu />
		</Provider>
	);

	await waitFor(() => screen.getByRole("button", { name: "menu" }));

	expect(screen.getByRole("button", { name: "menu" })).toBeInTheDocument();
});
