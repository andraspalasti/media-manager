import { Button, Flex } from "@chakra-ui/core";
import React from "react";
import ThemeToggler from "./components/ThemeToggler";
import Home from "./pages/Home";

function App() {
	return (
		<>
			<header>
				<Flex justifyContent="flex-end" p={3}>
					<Button justifySelf="" mr={3} ml={3} leftIcon="download">
						Torrents
					</Button>
					<ThemeToggler />
				</Flex>
			</header>
			<main>
				<Home />
			</main>
		</>
	);
}

export default App;
