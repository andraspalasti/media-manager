import { Box, Button, Flex, IconButton } from "@chakra-ui/react";
import { DownloadIcon, ArrowBackIcon } from "@chakra-ui/icons";
import React from "react";
import Home from "./pages/Home";
import { Switch, Route, useHistory } from "react-router-dom";
import Movies from "./pages/Movies";

function App() {
	const history = useHistory();
	// const { colorMode, toggleColorMode } = useColorMode();
	// if (colorMode !== "dark") toggleColorMode();
	return (
		<>
			<Switch>
				<Route path="/" exact>
					<Flex width="100%" justifyContent={"flex-end"} p={3}>
						<Button mr={2} leftIcon={<DownloadIcon />}>
							Torrents
						</Button>
					</Flex>
				</Route>
				<Route path="/">
					<Flex position="absolute" zIndex={10} width="100%" justifyContent="space-between" p={3}>
						<IconButton
							mr={3}
							onClick={() => history.push("/")}
							aria-label="Back button"
							bg="rgba(10, 10, 10, 0.2)"
							color="white"
							icon={<ArrowBackIcon />}
						/>
						<Box>
							<Button mr={2} leftIcon={<DownloadIcon />} bg="rgba(10, 10, 10, 0.2)" color="white">
								Torrents
							</Button>
						</Box>
					</Flex>
				</Route>
			</Switch>
			<main>
				<Switch>
					<Route path="/movies/:movieId">
						<Movies />
					</Route>
					<Route path="/">
						<Home />
					</Route>
				</Switch>
			</main>
		</>
	);
}

export default App;
