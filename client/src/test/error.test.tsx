import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../app/store";
import ErrorPopup from "../components/errorPopup/ErrorPopup";
import { openError, setError } from "../components/errorPopup/errorSlice";

test("error displays error message", async () => {
	store.dispatch(setError("This is an Error for testing"));
	store.dispatch(openError());

	render(
		<Provider store={store}>
			<ErrorPopup />
		</Provider>
	);

	fireEvent.click(screen.getByText("This is an Error for testing"));

	await waitFor(() => screen.getByText("This is an Error for testing"));

	expect(
		screen.getByText("This is an Error for testing")
	).toBeInTheDocument();
});
