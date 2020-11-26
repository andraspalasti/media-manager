import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import React from "react";
import { render } from "react-dom";
import App from "./App";
import "./css/App.css";
import { BrowserRouter as Router } from "react-router-dom";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
	uri: "http://192.168.1.37:4000/graphql",
	cache: new InMemoryCache(),
});

const customTheme = extendTheme({
	config: {
		useSystemColorMode: false,
		initialColorMode: "dark",
	},
});

const rootElement = document.getElementById("root");
render(
	<ApolloProvider client={client}>
		<ChakraProvider theme={customTheme}>
			<Router>
				<App />
			</Router>
		</ChakraProvider>
	</ApolloProvider>,
	rootElement
);
