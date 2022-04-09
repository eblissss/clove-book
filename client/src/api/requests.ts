import axios, { AxiosResponse } from "axios";
import { openError, setError } from "../components/errorPopup/errorSlice";
import * as models from "./models";
import { store } from "../app/store";

const instance = axios.create({
	baseURL: "https://api.clovebook.com",
	timeout: 15000,
	withCredentials: true,
});

const resBody = (res: AxiosResponse) => res.data;

const contentJSON = { "content-type": "application/json" };

const handleError = (err: any) => {
	if (err.response) {
		console.log("Bad status code");
		console.log(err.response);
	} else if (err.request) {
		console.log("No Response");
		console.log(err.request);
	} else {
		console.log("Request setup failed");
		console.log(err.message);
	}
	console.log(err.config);

	store.dispatch(
		setError(
			`${err.response.status} ${err.response.statusText}: ${err.response.data.error}`
		)
	);
	store.dispatch(openError());
};

// May need to send auth
const requests = {
	get: (url: string, params?: {}) =>
		instance.get(url, { params: params }).then(resBody).catch(handleError),
	post: (url: string, body: {}, params?: {}) =>
		instance
			.post(url, body, { params: params, headers: contentJSON })
			.then(resBody)
			.catch(handleError),
	put: (url: string, body: {}, params?: {}) =>
		instance
			.put(url, body, { params: params, headers: contentJSON })
			.then(resBody)
			.catch(handleError),
	delete: (url: string, params?: {}) =>
		instance
			.delete(url, { params: params })
			.then(resBody)
			.catch(handleError),
};

// ==== Recipe Section ====
export const toggleFavorite = (
	userID: string,
	set: boolean,
	recipeID: string
) => {
	requests.put(
		`/users/${userID}/favorites`,
		{},
		{ set: set, cookbookID: recipeID }
	);
};

export const getFavorites = (
	userID: string,
	query: string
): Promise<models.SimpleRecipe[]> =>
	requests.get(`/users/${userID}/favorites`, { query: query });

export const getFavoriteIDs = (
	userID: string,
	query: string
): Promise<string[]> =>
	requests.get(`/users/${userID}/favorites`, {
		query: query,
		onlyID: "true",
	});

export const addRecipe = (
	data: models.Recipe
): Promise<{ cookbookID: string }> => requests.post("/recipes", data);

export const getRecipes = (
	query: string,
	tags: string[]
): Promise<models.SimpleRecipe[]> =>
	requests.get("/recipes", { query: query, tags: tags });

export const getRecipe = (id: string): Promise<models.Recipe> =>
	requests.get(`/recipes/${id}`);

export const getPopularRecipes = (): Promise<models.SimpleRecipe[]> =>
	requests.get(`/recipes/popular`);

export const getUsersRecipes = (
	userID: string
): Promise<models.SimpleRecipe[]> => requests.get(`/users/${userID}/created`);

export const searchRecipesIngredients = (
	query: string,
	tags: string[],
	ingredients: string[]
): Promise<models.SimpleRecipe[]> =>
	requests.get("/recipes/ingredients", {
		query: query,
		tags: tags,
		ingredients: ingredients.join(","),
	});

export const deleteRecipe = (cookbookID: string) =>
	requests.delete(`/recipes/${cookbookID}`);

export const updateRecipe = (cookbookID: string, data: models.Recipe) =>
	requests.put(`/recipes/${cookbookID}`, data);

// ==== User Section ====
export const doRegister = (
	data: models.NewUser,
	code: string
): Promise<{ userID: string }> => requests.post("/users", data, { code: code });

export const doAuth = (data: models.Useremail): Promise<{ expires: string }> =>
	requests.post("/users/auth", data);

export const doRefresh = (
	refreshToken: string
): Promise<{ refreshToken: string }> =>
	requests.get("/users/refresh", { refreshToken: refreshToken });

export const doLogin = (
	data: models.Userpass
): Promise<{ refreshToken: string }> => requests.get("/users/login", data);

export const doLogout = () => requests.get("/users/logout");

export const getUser = (userID: string): Promise<models.User> =>
	requests.get(`/users/${userID}`);

export const updateUser = (userID: string, data: models.User) =>
	requests.put(`/users/${userID}`, data);

export const deleteUser = (userID: string) =>
	requests.delete(`/users/${userID}`);

// export const updateAllFavorites = (userID: string, data: string []) =>
// 	requests.put(`/users/${userID}/allfavorites`, data)
