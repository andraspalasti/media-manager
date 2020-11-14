import { Box, Button, Flex } from "@chakra-ui/core";
import React from "react";
import MediaSearchBar from "./components/MediaSearchBar";
import ThemeToggler from "./components/ThemeToggler";
import TrendingMovies from "./components/TrendingMovies";

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
				<Box maxW={["95%", "90%", "80%", "70%"]} ml="auto" mr="auto">
					<Box mb={6}>
						<MediaSearchBar />
					</Box>
					<TrendingMovies />
				</Box>
			</main>
		</>
	);
}

export default App;
