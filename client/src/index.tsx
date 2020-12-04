import { ChakraProvider, createStandaloneToast, extendTheme } from "@chakra-ui/react";
import React from "react";
import { render } from "react-dom";
import App from "./App";
import "./css/App.css";
import { BrowserRouter as Router } from "react-router-dom";
import { ApolloClient, ApolloProvider, InMemoryCache, HttpLink, split } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { WebSocketLink } from "@apollo/client/link/ws";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { getMainDefinition } from "@apollo/client/utilities";

const toast = createStandaloneToast({ colorMode: "dark" });
const customTheme = extendTheme({
	config: {
		useSystemColorMode: false,
		initialColorMode: "dark",
	},
});

const httpLink = new HttpLink({
	uri: `http://${process.env.REACT_APP_SERVER_IP}:${process.env.REACT_APP_SERVER_PORT}/graphql`,
});
const wsClient = new SubscriptionClient(`ws://${process.env.REACT_APP_SERVER_IP}:${process.env.REACT_APP_SERVER_PORT}/subscriptions`, {
	reconnect: true,
});
const wsLink = new WebSocketLink(wsClient);
const errorLink = onError(({ graphQLErrors, networkError }) => {
	if (graphQLErrors)
		graphQLErrors.forEach(({ message, locations, path }) => {
			console.log(`[GraphQL error]: Message: ${message}, Location: ${locations} Path: ${path}`);
			toast({
				title: "Ooops",
				description: message,
				status: "error",
				duration: 9000,
				isClosable: true,
			});
		});

	if (networkError) console.log(`[Network error]: ${networkError}`);
});
const client = new ApolloClient({
	link: errorLink.concat(
		split(
			({ query }) => {
				const { kind, operation }: any = getMainDefinition(query);
				return kind === "OperationDefinition" && operation === "subscription";
			},
			wsLink,
			httpLink
		)
	),
	cache: new InMemoryCache({
		typePolicies: {
			Query: {
				fields: {
					movies: {
						keyArgs: false,
						merge(existing, incoming, { args: { offset = 0 } }: any) {
							const merged = existing ? existing.movies.slice(0) : [];
							for (let i = 0; i < incoming.movies.length; ++i) {
								merged[offset + i] = incoming.movies[i];
							}
							return { ...existing, ...incoming, movies: merged };
						},
					},
				},
			},
		},
	}),
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
