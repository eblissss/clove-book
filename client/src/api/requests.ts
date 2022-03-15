import axios, { AxiosResponse } from "axios";
import * as models from "./models";

const instance = axios.create({
	baseURL: "http://jsonplaceholder.typicode.com/",
	timeout: 15000,
});

const resBody = (res: AxiosResponse) => res.data;

const requests = {
	// fill in with endpoints
};

// export object of endpoints for thing
export const Recipe = {
	// getFavoriteRecipes
	//
};

export const User = {
	// Login
};
