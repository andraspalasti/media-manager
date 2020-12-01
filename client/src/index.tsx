import { ChakraProvider, createStandaloneToast, extendTheme } from "@chakra-ui/react";
import React from "react";
import { render } from "react-dom";
import App from "./App";
import "./css/App.css";
import { BrowserRouter as Router } from "react-router-dom";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { onError } from "apollo-link-error";
import { HttpLink } from "apollo-link-http";

const customTheme = extendTheme({
	config: {
		useSystemColorMode: false,
		initialColorMode: "dark",
	},
});

const toast = createStandaloneToast({ colorMode: "dark" });

const httpLink = new HttpLink({
	uri: "http://192.168.1.37:4000/graphql",
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
	if (graphQLErrors)
		graphQLErrors.forEach(({ message, locations, path }) => {
			console.log(`[GraphQL error]: Message: ${message}, Location: ${locations} Path: ${path}`);
			toast({
				title: "Ooops.",
				description: message,
				status: "error",
				duration: 9000,
				isClosable: true,
			});
		});

	if (networkError) console.log(`[Network error]: ${networkError}`);
});

const client = new ApolloClient({
	link: errorLink.concat(httpLink) as any,
	cache: new InMemoryCache(),
});

const rootElement = document.getElementById("root");
render(
	<ChakraProvider theme={customTheme}>
		<ApolloProvider client={client}>
			<Router>
				<App />
			</Router>
		</ApolloProvider>
	</ChakraProvider>,
	rootElement
);
