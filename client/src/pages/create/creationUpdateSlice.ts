import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

interface CreationUpdate {
	success: boolean;
	editing: string;
}

const initialState: CreationUpdate = {
	success: false,
	editing: "",
};

export const creationUpdateSlice = createSlice({
	name: "creationUpdate",
	initialState,
	// The `reducers` field lets us define reducers and generate associated actions
	reducers: {
		setCreationSuccess: (state, action: PayloadAction<boolean>) => {
			state.success = action.payload;
		},
		setCreationEditing: (state, action: PayloadAction<string>) => {
			state.editing = action.payload;
		},
	},
});

export const { setCreationSuccess, setCreationEditing } =
	creationUpdateSlice.actions;

export const selectCreationUpdate = (state: RootState) => state.creationUpdate;

export default creationUpdateSlice.reducer;
