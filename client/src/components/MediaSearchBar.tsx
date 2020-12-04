import { Box, Center, Collapse, Grid, Input, InputGroup, InputLeftElement, Spinner } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import MediaRow from "./MediaRow";
import { useSearchMovieLazyQuery } from "../generated/graphql";

let debounceSearch: any;
let debounceClick: any;

const MediaSearchBar: React.FC = () => {
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTitle(e.target.value);
		if (e.target.value !== "") {
			setShow(true);
		} else {
			setShow(false);
		}
	};
	const [show, setShow] = useState(false);
	const [title, setTitle] = useState("");
	useEffect(() => {
		return function cleanup() {
			debounceClick && clearTimeout(debounceClick);
		};
	});
	return (
		<Box
			width="100%"
			position="relative"
			onBlur={() => {
				debounceClick = setTimeout(() => setShow(false), 300);
			}}
		>
			<InputGroup rounded="lg" zIndex={10} onFocus={() => title && setShow(true)}>
				<InputLeftElement children={<SearchIcon />} />
				<Input rounded="lg" value={title} type="text" placeholder="Search for movie or tv-show" onChange={handleChange} />
			</InputGroup>
			<Box zIndex={10} position="absolute" width="100%">
				<Collapse in={show} animateOpacity>
					<Box shadow="2xl" backgroundColor="gray.700" rounded="lg" p={3}>
						<Results title={title} />
					</Box>
				</Collapse>
			</Box>
		</Box>
	);
};

interface ResultProps {
	title: string;
}

const Results: React.FC<ResultProps> = ({ title }) => {
	const history = useHistory();
	const [searchForMovie, { loading, data, error }] = useSearchMovieLazyQuery();

	useEffect(() => {
		if (title !== "") {
			debounceSearch && clearTimeout(debounceSearch);
			debounceSearch = setTimeout(() => searchForMovie({ variables: { title } }), 300);
		}
	}, [searchForMovie, title]);

	if (error) {
		console.error(error);
		return <Center color="red.400">Ooops... an error occured</Center>;
	}
	if (loading) {
		return (
			<Center p={5}>
				<Spinner size="xl" />
			</Center>
		);
	}
	const movies = data?.searchMovie.results?.slice().sort((a, b) => b.popularity - a.popularity);
	if (!movies || movies.length === 0) {
		return <Center>No movies found</Center>;
	}
	return (
		<Grid templateColumns={{ base: "100%", md: "auto auto auto" }} maxH="50vh" overflow="auto" columnGap={6} pr={2} pb={3} rowGap={3}>
			{movies.slice(0, 6).map(({ id, title, release_date, poster_path, vote_average }) => {
				return (
					<MediaRow
						key={id}
						id={id}
						releaseDate={new Date(release_date || "")}
						rating={vote_average}
						imagePath={poster_path}
						title={title}
						onClick={() => history.push(`/movies/${id}`)}
					/>
				);
			})}
		</Grid>
	);
};

export default MediaSearchBar;
