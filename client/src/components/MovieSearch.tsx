import { gql, useQuery } from "@apollo/client";
import { Text, Divider, Flex, Grid, Spinner } from "@chakra-ui/core";
import React from "react";
import MediaRow from "./MediaRow";

interface MovieSearchProps {
	title: string;
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
	release_date: Date;
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

export default function MovieSearch({ title }: MovieSearchProps) {
	const { loading, error, data } = useQuery<searchMovie>(SEARCH_MOVIE, {
		variables: { title },
	});

	if (loading) {
		return (
			<Flex width="100%" justify="center">
				<Spinner size="md" />
			</Flex>
		);
	}
	if (error) {
		return <p>Error occured</p>;
	}
	const movies = data?.searchMovie.results.slice().sort((a, b) => b.popularity - a.popularity);
	// movies?.sort((a, b) => a.popularity - b.popularity);
	console.log(movies);

	return (
		<>
			<Flex fontWeight="semibold" as="h3" fontSize="md" lineHeight="tight" isTruncated>
				Movies
				<Text ml={1} color="gray.400">
					({movies?.length})
				</Text>
			</Flex>
			<Divider borderColor="gray.400" />
			<Grid templateColumns={{ base: "100%", md: "auto auto auto" }} columnGap={6} rowGap={3}>
				{movies &&
					movies.slice(0, 3).map(({ id, genres, title, release_date, poster_path, vote_average }) => {
						return (
							<MediaRow key={id} id={id} genres={genres} releaseDate={release_date} rating={vote_average} imagePath={poster_path} title={title} />
						);
					})}
			</Grid>
		</>
	);
}
