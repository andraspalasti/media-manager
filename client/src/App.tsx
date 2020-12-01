import { Box, Button, Flex, IconButton } from "@chakra-ui/react";
import { DownloadIcon, ArrowBackIcon } from "@chakra-ui/icons";
import React from "react";
import Home from "./pages/Home";
import { Switch, Route, useHistory } from "react-router-dom";
import { Movies } from "./pages/Movies";
import Torrents from "./pages/Torrents";

function App() {
	const history = useHistory();
	return (
		<>
			<Switch>
				<Route path="/movies/:movieId">
					<MoviesHeader />
				</Route>
				<Route path="/">
					<Flex width="100%" justifyContent="flex-end" p={3}>
						<Route path="/torrents">
							<IconButton onClick={() => history.push("/")} aria-label="Back button" icon={<ArrowBackIcon />} />
						</Route>
						<Button mr={2} leftIcon={<DownloadIcon />} onClick={() => history.push("/torrents")}>
							Torrents
						</Button>
					</Flex>
				</Route>
			</Switch>
			<main>
				<Switch>
					<Route path="/movies/:movieId">
						<Movies />
					</Route>
					<Route path="/torrents">
						<Torrents />
					</Route>
					<Route path="/">
						<Home />
					</Route>
				</Switch>
			</main>
		</>
	);
}

const MoviesHeader: React.FC = () => {
	const history = useHistory();
	return (
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
	);
};

export default App;
