import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import React from "react";
import { render } from "react-dom";
import App from "./App";
import "./css/App.css";
import { BrowserRouter as Router } from "react-router-dom";

const config = {
	useSystemColorMode: false,
	initialColorMode: "dark",
};

// 3. extend the theme
const customTheme = extendTheme({ config });

const client = new ApolloClient({
	uri: "http://192.168.1.37:4000/graphql",
	cache: new InMemoryCache(),
});

const rootElement = document.getElementById("root");
render(
	<ChakraProvider theme={customTheme}>
		<ApolloProvider client={client}>
			<Router>
				{/* <ColorModeScript initialColorMode="dark" /> */}
				<App />
			</Router>
		</ApolloProvider>
	</ChakraProvider>,
	rootElement
);
