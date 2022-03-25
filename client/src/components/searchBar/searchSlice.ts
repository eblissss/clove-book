import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export interface SearchState {
	searchTags: string[];
	sort: string;
	filters: string[];
}

const initialState: SearchState = {
	searchTags: [],
	sort: "best",
	filters: [],
};

export const searchSlice = createSlice({
	name: "search",
	initialState,
	// The `reducers` field lets us define reducers and generate associated actions
	reducers: {
		addSearchTag: (state, action: PayloadAction<string>) => {
			state.searchTags.push(action.payload);
		},
		setSearchTags: (state, action: PayloadAction<string[]>) => {
			state.searchTags = action.payload;
		},
		setSearchSort: (state, action: PayloadAction<string>) => {
			state.sort = action.payload;
		},
		setSearchFilters: (state, action: PayloadAction<string[]>) => {
			state.filters = action.payload;
		},
	},
});

export const { addSearchTag, setSearchTags, setSearchSort, setSearchFilters } =
	searchSlice.actions;

export const selectSearch = (state: RootState) => state.search;

export default searchSlice.reducer;
