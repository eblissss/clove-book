import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { enableMapSet } from "immer";
import { toggleFavorite } from "../../api/requests";
import { RootState } from "../../app/store";

enableMapSet();

export interface FavoriteState {
	favoriteSet: Set<string>;
	userID: string;
}

const initialState: FavoriteState = {
	favoriteSet: new Set<string>(),
	userID: "",
};

export const favoriteSlice = createSlice({
	name: "favorite",
	initialState,
	// The `reducers` field lets us define reducers and generate associated actions
	reducers: {
		updateFavorite: (
			state,
			action: PayloadAction<{ id: string; set: boolean }>
		) => {
			if (
				action.payload.set &&
				!state.favoriteSet.has(action.payload.id)
			) {
				state.favoriteSet.add(action.payload.id);
			} else {
				state.favoriteSet.delete(action.payload.id);
			}
			// API Call
			toggleFavorite(state.userID, action.payload.set, action.payload.id);
		},
		setInitialFavorites: (
			state,
			action: PayloadAction<{ data: string[]; userID: string }>
		) => {
			state.favoriteSet = new Set(action.payload.data);
			state.userID = action.payload.userID;
		},
	},
});

export const { updateFavorite, setInitialFavorites } = favoriteSlice.actions;

// returns whether ID is a favorite
export const selectFavoriteByID = (id: string) => (state: RootState) =>
	state.favorite.favoriteSet.has(id);

export default favoriteSlice.reducer;
