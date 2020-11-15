import { Box } from "@chakra-ui/core";
import React from "react";
import MediaSearchBar from "../components/MediaSearchBar";
import TrendingMovies from "../components/TrendingMovies";

function Home() {
	return (
		<Box maxW={["95%", "90%", "80%", "70%"]} ml="auto" mr="auto">
			<Box mb={6}>
				<MediaSearchBar />
			</Box>
			<TrendingMovies />
		</Box>
	);
}

export default Home;
