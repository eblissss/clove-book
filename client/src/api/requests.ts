import axios, { AxiosResponse } from "axios";
import { userInfo } from "os";
import * as models from "./models";

const instance = axios.create({
	baseURL: "http://api.clovebook.com/",
	timeout: 15000,
});

const resBody = (res: AxiosResponse) => res.data;

const contentJSON = { headers: { "content-type": "application/json" } };

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

const requests = {
	get: (url: string) => instance.get(url).then(resBody).catch(handleError),
	post: (url: string, body: {}) =>
		instance.post(url, body, contentJSON).then(resBody).catch(handleError),
};

export const doLogin = (data: models.Userpass): Promise<models.User> =>
	requests.post("/users/login", data);

export const doRegister = (data: models.NewUser): Promise<models.User> =>
	requests.post("/users", data);

export const doAuth = (data: models.Useremail): Promise<{ expires: string }> =>
	requests.post("/users/auth", data);
