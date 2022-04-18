import md5 from "md5";
import * as REQUESTS from "../api/requests";

test("Checks login", () => {
	expect(
		REQUESTS.doLogin({ username: "ee", password: md5("password") }).then(
			(r) => r.refreshToken
		)
	).toBeInstanceOf("string");
});
