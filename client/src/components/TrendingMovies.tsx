import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, Divider, Flex, Heading, Spinner, Text } from "@chakra-ui/react";
import React from "react";
import { useHistory } from "react-router-dom";
import { useTrendingMoviesQuery } from "../generated/graphql";
import { MediaCard } from "./MediaCard";

export const TrendingMovies: React.FC = () => {
	const history = useHistory();
	const { loading, error, data } = useTrendingMoviesQuery();
	if (loading)
		return (
			<Flex justifyContent="center" m="auto" alignItems="center" size="xs">
				<Spinner size="xl" />
			</Flex>
		);
	if (error)
		return (
			<Alert rounded="lg" status="error" variant="top-accent" flexDirection="column" p={3} justifyContent="center" textAlign="center">
				<AlertIcon w="40px" h="40px" mr={0} />
				<AlertTitle mt={4} mb={1} fontSize="lg">
					Ooops...
				</AlertTitle>
				<AlertDescription maxWidth="sm">There was an error with the requested data.</AlertDescription>
			</Alert>
		);
	const trendingMovies = data?.trendingMovies.results;
	return (
		<>
			<Heading fontWeight="semibold" size="md" d="flex">
				Trending Movies
				<Text ml={1} color="gray.400" fontWeight={400}>
					({trendingMovies && trendingMovies.length})
				</Text>
			</Heading>
			<Divider borderColor="gray.300" mt={1} mb={2} />
			<Flex overflowX="auto" height="auto" pb={2} style={{ gap: 14 }}>
				{trendingMovies &&
					trendingMovies.map((movie: any) => {
						return (
							<Box
								width={{ base: 200, md: 240 }}
								position="relative"
								flexShrink={0}
								display="inline-block"
								transition="all ease-in-out 200ms"
								rounded="lg"
								borderBottom="3px solid transparent"
								_hover={{ cursor: "pointer", borderBottom: "3px solid", borderColor: "blue.300" }}
								key={movie.id}
								overflow="hidden"
							>
								<MediaCard
									id={movie.id}
									title={movie.title}
									imgPath={movie.poster_path}
									genres={movie.genres}
									rating={movie.vote_average}
									onClick={(id) => {
										history.push(`/movies/${id}`);
									}}
								/>
							</Box>
						);
					})}
			</Flex>
		</>
	);
};
