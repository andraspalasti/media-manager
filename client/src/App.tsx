import { Button, Flex, IconButton } from "@chakra-ui/react";
import { DownloadIcon } from "@chakra-ui/icons";
import React from "react";
import Home from "./pages/Home";
import { Switch, Route, useHistory } from "react-router-dom";
import { Movies } from "./pages/Movies";
import Torrents from "./pages/Torrents";
import { HomeIcon } from "./icons/HomeIcon";

function App() {
	const history = useHistory();
	return (
		<>
			<Switch>
				<Route path="/movies/:movieId">
					<MoviesHeader />
				</Route>
				<Route path="/">
					<Flex width="100%" p={3}>
						<Route path="/torrents">
							<IconButton
								justifyItems="flex-start"
								onClick={() => history.push("/")}
								aria-label="Home button"
								icon={<HomeIcon w="1.4em" h="1.4em" />}
							/>
						</Route>
						<Route exact path="/">
							<Button mr={2} ml="auto" justifyItems="flex-end" leftIcon={<DownloadIcon />} onClick={() => history.push("/torrents")}>
								Torrents
							</Button>
						</Route>
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
				aria-label="Home button"
				bg="rgba(10, 10, 10, 0.2)"
				color="white"
				icon={<HomeIcon w="1.4em" h="1.4em" />}
			/>
			<Button mr={2} leftIcon={<DownloadIcon />} bg="rgba(10, 10, 10, 0.2)" onClick={() => history.push("/torrents")} color="white">
				Torrents
			</Button>
		</Flex>
	);
};

export default App;
