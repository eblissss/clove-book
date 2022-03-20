import axios, { AxiosResponse } from "axios";
import * as models from "./models";

const instance = axios.create({
	baseURL: "http://api.clovebook.com/",
	timeout: 15000,
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

// All requests are add*, update*, delete*, get*, or do*

// ==== Recipe Section ====
export const addFavorite = (
	username: string,
	useCookbook: boolean,
	id: number
) => {
	if (useCookbook)
		requests.post(`/users/${username}/favorites`, { cookbookID: id });
	else requests.post(`/users/${username}/favorites`, { spoonacularID: id });
};

export const getFavorites = (username: string, query: string) => {
	requests.get(`/users/${username}/favorites`, { query: query });
};

export const addRecipe = (
	data: models.Recipe
): Promise<{ cookbookID: number }> => requests.post("/recipes", data);

export const getRecipes = (
	query: string,
	tags: string[]
): Promise<models.SimpleRecipe> =>
	requests.get("/recipes", { query: query, tags: tags });

export const deleteRecipe = (cookbookID: number) =>
	requests.delete(`/recipes/${cookbookID}`);

export const updateRecipe = (cookbookID: number, data: models.Recipe) =>
	requests.put(`/recipes/${cookbookID}`, data);

// ==== Ingredient Section ====
export const getIngredients = (username: string): Promise<models.Ingredient> =>
	requests.get(`/users/${username}/ingredients`);

export const addIngredients = (username: string, data: models.Ingredient[]) =>
	requests.post(`/users/${username}/ingredients`, data);

export const deleteIngredients = (username: string, ingredients: string) =>
	requests.delete(`/users/${username}/ingredients`, ingredients);

export const updateIngredients = (username: string, data: models.Ingredient) =>
	requests.put(`/users/${username}/ingredients`, data, {
		ingredient: data.name,
	});

// ==== User Section ====
export const doRegister = (data: models.NewUser): Promise<models.User> =>
	requests.post("/users", data);

export const doAuth = (data: models.Useremail): Promise<{ expires: string }> =>
	requests.post("/users/auth", data);

export const doLogin = (data: models.Userpass): Promise<models.User> =>
	requests.get("/users/login", data);

export const doLogout = () => requests.get("/users/logout");

export const getUser = (username: string): Promise<models.User> =>
	requests.get(`/users/${username}`);

export const updateUser = (username: string, data: models.User) =>
	requests.put(`/users/${username}`, data);

export const deleteUser = (username: string) =>
	requests.delete(`/users/${username}`);
