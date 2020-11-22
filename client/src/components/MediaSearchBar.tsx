import { useLazyQuery, gql } from "@apollo/client";
import { Box, Collapse, Grid, Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import MediaRow from "./MediaRow";
// import MovieSearch from "./MovieSearch";

export default function MediaSearchBar() {
	const history = useHistory();
	// const { colorMode } = useColorMode();
	const [show, setShow] = useState(false);
	const [title, setTitle] = useState("");
	// const backgrounds = { light: "white", dark: "gray.700" };

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
		<Box width="100%" position="relative">
			<InputGroup rounded="lg" zIndex={10} onFocus={() => title && setShow(true)} onBlur={() => setShow(false)}>
				<InputLeftElement children={<SearchIcon />} />
				<Input rounded="lg" value={title} type="text" placeholder="Search for movie or tv-show" onChange={handleChange} />
			</InputGroup>
			<Box position="absolute" zIndex={9} width="100%">
				<Collapse in={show} animateOpacity>
					<Box shadow="0 10px 15px -3px rgba(0,0,0,0.4)" transition="height ease-in-out 300ms" backgroundColor="gray.700" rounded="lg" p={3}>
						{loading && <Box>Searching for movies</Box>}
						{movies?.length === 0 && <Box>No movies found</Box>}
						<Grid
							templateColumns={{ base: "100%", md: "auto auto auto" }}
							maxH={{ base: "50vh", md: "70vh" }}
							overflow="auto"
							columnGap={6}
							pr={2}
							rowGap={3}
						>
							{movies &&
								movies.slice(0, 3).map(({ id, genres, title, release_date, poster_path, vote_average }) => {
									console.log(typeof release_date);

									return (
										<MediaRow
											key={id}
											id={id}
											genres={genres}
											releaseDate={new Date(release_date.toString())}
											rating={vote_average}
											imagePath={poster_path}
											title={title}
											onClick={(id) => history.push(`/movies/${id}`)}
										/>
									);
								})}
						</Grid>
					</Box>
				</Collapse>
			</Box>
		</Box>
	);
}

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
