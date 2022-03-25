import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

import { User } from "../../api/models";

const initialState: User = {
	userID: "0",
	username: "Fire",
	firstName: "John",
	lastName: "Dover",
	email: "flame@gmail.com",
	createdAt: "00:00 idk format",
	updatedAt: "00:00 idk format",
	password: "passhash",
};

export const userSlice = createSlice({
	name: "user",
	initialState,
	// The `reducers` field lets us define reducers and generate associated actions
	reducers: {
		setUserID: (state, action: PayloadAction<string>) => {
			state.userID = action.payload;
		},
		setUser: (state, action: PayloadAction<User>) => {
			state = action.payload;
		},
	},
});

export const { setUserID, setUser } = userSlice.actions;

export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;
