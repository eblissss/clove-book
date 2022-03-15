import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import counterReducer from "../components/counter/counterSlice";
import sceneReducer from "../components/scene/sceneSlice";
import searchReducer from "../components/searchBar/searchSlice";

export const store = configureStore({
	reducer: {
		counter: counterReducer,
		scene: sceneReducer,
		search: searchReducer,
	},
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
	ReturnType,
	RootState,
	unknown,
	Action<string>
>;
