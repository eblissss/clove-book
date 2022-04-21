export const isEmail = (email: string): string => {
	if (email.length === 0) {
		return "Please enter an email";
	}
	const regexp = new RegExp(
		/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	);
	if (!regexp.test(email)) {
		return "Enter a valid email address";
	}
	return "";
};

export const isUsername = (username: string): string => {
	if (username.length === 0) {
		return "Please enter a username";
	}
	if (username.indexOf(" ") !== -1) {
		return "Username cannot contain spaces.";
	}
	if (username.length < 5) {
		return "Username must be at least 5 characters.";
	}
	return "";
};

export const isPassword = (password: string): string => {
	if (password.length === 0) {
		return "Please enter a password";
	}
	if (password.length < 6) {
		return "Password must be at least 6 characters.";
	}
	if (password.toLowerCase() === password) {
		return "Password must have at least 1 uppercase letter.";
	}
	if (password.toUpperCase() === password) {
		return "Password must have at least 1 lowercase letter.";
	}
	if (!/\d/.test(password)) {
		return "Password must have at least 1 number.";
	}
	return "";
};

// kat & ethan were here troll XDDDD
// kat is very funny /s
export const isGoodName = (name: string): string => {
	if (name.length === 0) {
		return "Please enter your name.";
	}
	if (name === "Rick" || name === "Leinecker" || name === "rick") {
		return "Choose a better name.";
	}
	return "";
};
