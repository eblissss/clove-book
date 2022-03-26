import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

import { User } from "../../api/models";

interface userinblock {
	user: User;
}

const initialState: userinblock = {
	user: {
		userID: "0",
		username: "Fire",
		firstName: "John",
		lastName: "Dover",
		email: "flame@gmail.com",
		createdAt: "2022-03-25T20:33:43.421Z",
		updatedAt: "2022-03-25T20:33:43.421Z",
		password: "passhash",
	},
};

export const userSlice = createSlice({
	name: "user",
	initialState,
	// The `reducers` field lets us define reducers and generate associated actions
	reducers: {
		setUserID: (state, action: PayloadAction<string>) => {
			state.user.userID = action.payload;
		},
		setUser: (state, action: PayloadAction<User>) => {
			state.user = action.payload;
			console.log(state.user);
		},
	},
});

export const { setUserID, setUser } = userSlice.actions;

export const selectUser = (state: RootState) => state.user.user;

export default userSlice.reducer;
