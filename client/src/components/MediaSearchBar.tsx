import { useLazyQuery, gql } from "@apollo/client";
import { Box, Collapse, Grid, Icon, Input, InputGroup, InputLeftElement, useColorMode } from "@chakra-ui/core";
import React, { useState } from "react";
import MediaRow from "./MediaRow";
// import MovieSearch from "./MovieSearch";

export default function MediaSearchBar() {
	const { colorMode } = useColorMode();
	const [show, setShow] = useState(false);
	const [title, setTitle] = useState("");
	const backgrounds = { light: "white", dark: "gray.700" };

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTitle(e.target.value);
		if (e.target.value !== "") {
			searchMovie({ variables: { title: e.target.value } });
			setShow(true);
		} else {
			setShow(false);
		}
	};

	const [searchMovie, { data, loading, error }] = useLazyQuery<searchMovie>(SEARCH_MOVIE);
	const movies = data?.searchMovie.results.slice().sort((a, b) => b.popularity - a.popularity);
	// const handler = useCallback(debounce(searchMovie({ variables: { title } }), 2000), []);
	error && console.error(error);
	data && console.log(data);
	return (
		<Box position="relative">
			<InputGroup
				rounded="lg"
				zIndex={10}
				onFocus={() => title && setShow(true)}
				// onBlur={() => setShow(false)}
			>
				<InputLeftElement children={<Icon name="search" />} />
				<Input rounded="lg" value={title} type="text" placeholder="Search for movie or tv-show" onChange={handleChange} />
			</InputGroup>
			<Box position="absolute" zIndex={9} width="100%">
				<Collapse width="100%" shadow="0 10px 15px -3px rgba(0,0,0,0.4)" backgroundColor={backgrounds[colorMode]} rounded="lg" isOpen={show} p={3}>
					{loading && <Box>Searching for movies</Box>}
					{movies?.length === 0 && <Box>No movies found</Box>}
					<Grid templateColumns={{ base: "100%", md: "auto auto auto" }} columnGap={6} rowGap={3}>
						{movies &&
							movies.slice(0, 8).map(({ id, genres, title, release_date, poster_path, vote_average }) => {
								return (
									<MediaRow
										key={id}
										id={id}
										genres={genres}
										releaseDate={new Date(release_date)}
										rating={vote_average}
										imagePath={poster_path}
										title={title}
									/>
								);
							})}
					</Grid>
				</Collapse>
			</Box>
		</Box>
	);
}

// function MovieSearch({ title }: { title: string }) {
// 	const { loading, error, data } = useQuery<searchMovie>(SEARCH_MOVIE, {
// 		variables: { title },
// 	});

// 	if (loading) {
// 		return (
// 			<Flex width="100%" justify="center">
// 				<Spinner size="md" />
// 			</Flex>
// 		);
// 	}
// 	if (error) {
// 		return <p>Error occured</p>;
// 	}
// 	const movies = data?.searchMovie.results.slice().sort((a, b) => b.popularity - a.popularity);
// 	// movies?.sort((a, b) => a.popularity - b.popularity);
// 	console.log(movies);

// 	return (
// 		<>
// 			<Flex fontWeight="semibold" as="h3" fontSize="md" lineHeight="tight" isTruncated>
// 				Movies
// 				<Text ml={1} color="gray.400">
// 					({movies?.length})
// 				</Text>
// 			</Flex>
// 			<Divider borderColor="gray.400" />
// 			<Grid templateColumns={{ base: "100%", md: "auto auto auto" }} columnGap={6} rowGap={3}>
// 				{movies &&
// 					movies.slice(0, 3).map(({ id, genres, title, release_date, poster_path, vote_average }) => {
// 						return (
// 							<MediaRow key={id} id={id} genres={genres} releaseDate={release_date} rating={vote_average} imagePath={poster_path} title={title} />
// 						);
// 					})}
// 			</Grid>
// 		</>
// 	);
// }

// const debounce = (func: any, wait: number) => {
// 	let timeout: any;
// 	return function executedFunction(...args: any[]) {
// 		const later = () => {
// 			timeout = null;
// 			func(...args);
// 		};
// 		clearTimeout(timeout);
// 		timeout = setTimeout(later, wait);
// 	};
// };

interface searchMovie {
	searchMovie: {
		results: Movie[];
	};
}

interface Movie {
	id: number;
	title: string;
	genres: string[];
	release_date: string;
	popularity: number;
	vote_average: number;
	poster_path: string;
}

const SEARCH_MOVIE = gql`
	query SearchMovie($title: String!) {
		searchMovie(title: $title) {
			results {
				id
				title
				genres
				release_date
				popularity
				vote_average
				poster_path
			}
		}
	}
`;
