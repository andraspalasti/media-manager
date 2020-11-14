import { ColorModeProvider, CSSReset, ThemeProvider } from "@chakra-ui/core";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import React from "react";
import { render } from "react-dom";
import App from "./App";
import "./css/App.css";

const client = new ApolloClient({
	uri: "http://192.168.1.37:4000/graphql",
	cache: new InMemoryCache(),
});

const rootElement = document.getElementById("root");
render(
	<ThemeProvider>
		<ColorModeProvider>
			<CSSReset />
			<ApolloProvider client={client}>
				<App />
			</ApolloProvider>
		</ColorModeProvider>
	</ThemeProvider>,
	rootElement
);
