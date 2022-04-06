import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { enableMapSet } from "immer";
import { getFavoriteIDs, toggleFavorite } from "../../api/requests";
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
			console.log("favorite", action.payload.set, action.payload.id);
			toggleFavorite(state.userID, action.payload.set, action.payload.id);
		},
		setInitialFavorites: (
			state,
			action: PayloadAction<{ data: string[] }>
		) => {
			state.favoriteSet = new Set(action.payload.data);
		},
	},
});

export const { updateFavorite, setInitialFavorites } = favoriteSlice.actions;

// returns whether ID is a favorite
// export const selectFavorite = (state: RootState) =>
// 	state.favorite.favoriteSet.has(id);

export const selectFavoriteByID = (id: string) => (state: RootState) =>
	state.favorite.favoriteSet.has(id);

// export const selectFavoriteByID = createSelector(
// 	[
// 		// Usual first input - extract value from `state`
// 		(state) => state.favoriteSet,
// 		// Take the second arg, `category`, and forward to the output selector
// 		(state, id) => id,
// 	],
// 	// Output selector gets (`items, id)` as args
// 	(favoriteSet, id) => favoriteSet.has(id)
// );

export default favoriteSlice.reducer;
