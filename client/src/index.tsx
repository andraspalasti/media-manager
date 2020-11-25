import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import React from "react";
import { render } from "react-dom";
import App from "./App";
import "./css/App.css";
import { BrowserRouter as Router } from "react-router-dom";
import { createClient, Provider } from "urql";

const urqlClient = createClient({
	url: "http://192.168.1.37:4000/graphql",
});

const customTheme = extendTheme({
	config: {
		useSystemColorMode: false,
		initialColorMode: "dark",
	},
});

const rootElement = document.getElementById("root");
render(
	<ChakraProvider theme={customTheme}>
		<Provider value={urqlClient}>
			<Router>
				<App />
			</Router>
		</Provider>
	</ChakraProvider>,
	rootElement
);
