import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export interface SearchState {
	searchVal: string;
}

const initialState: SearchState = {
	searchVal: "",
};

export const searchSlice = createSlice({
	name: "search",
	initialState,
	// The `reducers` field lets us define reducers and generate associated actions
	reducers: {
		setSearch: (state, action: PayloadAction<string>) => {
			state.searchVal = action.payload;
		},
	},
});

export const { setSearch } = searchSlice.actions;

export const selectSearch = (state: RootState) => state.search.searchVal;

export default searchSlice.reducer;
