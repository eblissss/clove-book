import React from "react";
import ReactDOM from "react-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import App from "./pages/app/App";
import theme from "./theme";
import { store } from "./app/store";
import { Provider } from "react-redux";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			<ThemeProvider theme={theme}>
				{/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
				<CssBaseline />
				<App />
			</ThemeProvider>
		</Provider>
	</React.StrictMode>,
	document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
