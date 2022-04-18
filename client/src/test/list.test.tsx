import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../app/store";
import StepList from "../pages/create/StepsList";

test("step lists has placeholders", async () => {
	render(
		<Provider store={store}>
			<StepList />
		</Provider>
	);

	fireEvent.click(screen.getByPlaceholderText("Add a new step"));

	await waitFor(() => screen.getByPlaceholderText("Add a new step"));

	expect(screen.getByPlaceholderText("Add a new step")).toBeInTheDocument();
});

test("step lists has title", async () => {
	render(
		<Provider store={store}>
			<StepList />
		</Provider>
	);

	fireEvent.click(screen.getByText("Recipe Steps:"));

	await waitFor(() => screen.getByText("Recipe Steps:"));

	expect(screen.getByText("Recipe Steps:")).toBeInTheDocument();
});
