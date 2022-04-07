import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import counterReducer from "../components/counter/counterSlice";
import sceneReducer from "../components/scene/sceneSlice";
import searchReducer from "../components/searchBar/searchSlice";
import modalReducer from "../components/recipeModal/modalSlice";
import errorReducer from "../components/errorPopup/errorSlice";
import userReducer from "../pages/user/userSlice";
import creationReducer from "../pages/create/creationSlice";
import creationUpdateReducer from "../pages/create/creationUpdateSlice";
import recipeReducer from "../components/recipeModal/recipeSlice";
import favoriteReducer from "../components/userFavs/favSlice";

export const store = configureStore({
	reducer: {
		counter: counterReducer,
		scene: sceneReducer,
		search: searchReducer,
		modal: modalReducer,
		error: errorReducer,
		user: userReducer,
		creation: creationReducer,
		creationUpdate: creationUpdateReducer,
		recipe: recipeReducer,
		favorite: favoriteReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
	ReturnType,
	RootState,
	unknown,
	Action<string>
>;
