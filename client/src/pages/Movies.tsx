import { gql, useQuery } from "@apollo/client";
import { Box, Flex, Spinner, Text } from "@chakra-ui/core";
import React from "react";
import { useParams } from "react-router-dom";
import LoadingImage from "../components/LoadingImage";
import Rating from "../components/Rating";

function Movies() {
	const { movieId }: { movieId: string | undefined } = useParams();
	console.log(movieId);

	const { loading, error, data } = useQuery(MOVIE_DETAILS, { variables: { id: Number(movieId) } });
	if (loading) {
		return (
			<Flex justifyContent="center" width="100%" m="auto" height="100vh" alignItems="center" size="xs">
				<Spinner size="xl" />
			</Flex>
		);
	}
	error && console.error(error);

	console.log(data);
	const movie: MovieDetails = data.getMovieDetails;
	const runtime = new Date(0, 0, 0, 0, movie.runtime || 0);

	return (
		<Box width="100%" ml="auto" mr="auto">
			<Box position="relative" d={{ base: "block", md: "grid" }} gridTemplateColumns="repeat(8, minmax(0, 1fr))" alignItems="center" width="100%">
				<Box gridRow={1} gridColumn="4 / 10" width="100%">
					<LoadingImage imagePath={movie.backdrop_path} style={{ ml: "auto" }} sizes={[300, 780, 1280]} />
				</Box>
				<Box
					position="relative"
					height="100%"
					zIndex={1}
					gridColumn="2 / 5"
					gridRow={1}
					background="linear-gradient(86deg, #1A202C 70%, transparent 95%)"
				>
					<Box position="absolute" transform="translate(0%, -50%)" top="50%" left="0%">
						<Text fontSize="5xl">{movie.title}</Text>
						<Flex mt={1} color="gray.400">
							<Box mr={4}>
								<Rating rating={movie.vote_average} />
							</Box>
							<Text mr={4}>{new Date(movie.release_date).getFullYear()}</Text>
							<Text mr={4} isTruncated>
								{runtime.getHours() && `${runtime.getHours()}h`} {runtime.getMinutes() && `${runtime.getMinutes()}`}
							</Text>
						</Flex>
						<Text mb={4} color="gray.400">
							{movie.genres.map(({ name }) => name).join(" | ")}
						</Text>
						<Text maxH="4.2em" overflow="hidden" width="90%">
							{movie.overview}
						</Text>
					</Box>
				</Box>
			</Box>
		</Box>
	);
}

const MOVIE_DETAILS = gql`
	query getMovieDetails($id: Float!) {
		getMovieDetails(id: $id) {
			id
			title
			poster_path
			overview
			release_date
			vote_average
			backdrop_path
			revenue
			runtime
			status
			tagline
			genres {
				name
			}
		}
	}
`;

interface MovieDetails {
	poster_path: string;
	overview: string;
	release_date: string;
	id: number;
	title: string;
	backdrop_path: string;
	popularity: number;
	vote_average: number;
	revenue: number;
	genres: Genre[];
	runtime: number | null;
	status: string;
	tagline: string | null;
}

interface Genre {
	id: number;
	name: string;
}

export default Movies;
