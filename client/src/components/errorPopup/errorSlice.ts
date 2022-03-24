import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export interface ErrorState {
	error: string;
	isOpen: boolean;
}

const initialState: ErrorState = {
	error: "",
	isOpen: false,
};

export const errorSlice = createSlice({
	name: "error",
	initialState,
	// The `reducers` field lets us define reducers and generate associated actions
	reducers: {
		setError: (state, action: PayloadAction<{ error: string }>) => {
			state.error = action.payload.error;
		},
		openError: (state) => {
			state.isOpen = true;
		},
		closeError: (state) => {
			state.isOpen = false;
		},
	},
});

export const { setError, openError, closeError } = errorSlice.actions;

export const selectError = (state: RootState) => state.error;

export default errorSlice.reducer;
