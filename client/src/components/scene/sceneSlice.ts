import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export interface SceneState {
	time: string;
	status: "idle" | "loading" | "failed";
}

const initialState: SceneState = {
	time: "login",
	status: "idle",
};

export const sceneSlice = createSlice({
	name: "scene",
	initialState,
	// The `reducers` field lets us define reducers and generate associated actions
	reducers: {
		changeToDawn: (state) => {
			state.time = "dawn";
		},
		changeToNoon: (state) => {
			state.time = "noon";
		},
	},
});

export const { changeToDawn, changeToNoon } = sceneSlice.actions;

export const selectTime = (state: RootState) => state.scene.time;

export default sceneSlice.reducer;
