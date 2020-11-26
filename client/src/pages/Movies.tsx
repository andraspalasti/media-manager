import {
	Alert,
	AlertDescription,
	AlertIcon,
	AlertTitle,
	Box,
	Center,
	Divider,
	Flex,
	Grid,
	Heading,
	Spinner,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	Text,
} from "@chakra-ui/react";
import React from "react";
import { useParams } from "react-router-dom";
import { LoadingImage } from "../components/LoadingImage";
import { Rating } from "../components/Rating";
import { Videos } from "../components/Videos";
import { useMovieDetailsQuery } from "../generated/graphql";

export const Movies = () => {
	const { movieId }: { movieId: string } = useParams();

	const { loading, error, data } = useMovieDetailsQuery({ variables: { id: movieId } });
	if (loading) {
		return (
			<Center width="100%" height="100vh" size="xs">
				<Spinner size="xl" />
			</Center>
		);
	}
	if (error) {
		return (
			<Alert rounded="lg" status="error" variant="top-accent" flexDirection="column" p={3} justifyContent="center" textAlign="center">
				<AlertIcon w="40px" h="40px" mr={0} />
				<AlertTitle mt={4} mb={1} fontSize="lg">
					Ooops...
				</AlertTitle>
				<AlertDescription maxWidth="sm">There was an error with the requested data.</AlertDescription>
			</Alert>
		);
	}

	const movie = data?.movieDetails;
	const runtime = new Date(0, 0, 0, 0, movie?.runtime || 0);
	return (
		<Box width="100%" mx="auto">
			<Box position="relative" d={{ base: "block", md: "grid" }} gridTemplateColumns="repeat(8, minmax(0, 1fr))" alignItems="center" width="100%">
				<Box gridRow={1} gridColumn="4 / 10" width="100%">
					<LoadingImage imagePath={movie?.backdrop_path || ""} style={{ ml: "auto" }} sizes={[300, 780, 1280]} />
				</Box>
				<Box
					position="relative"
					height="100%"
					zIndex={1}
					gridColumn="2 / 5"
					gridRow={1}
					background={{ base: "none", md: "linear-gradient(86deg, #1A202C 70%, transparent 95%)" }}
				>
					<Box
						position={{ base: "unset", md: "absolute" }}
						transform={{ base: "translate(0%, -10%)", md: "translate(0%, -50%)" }}
						top="50%"
						left="0%"
						background={{ base: "linear-gradient(to top, #1A202C 90%, transparent)", md: "none" }}
					>
						<Box mx={3}>
							<Text fontSize={{ base: "4xl", md: "5xl" }} lineHeight="1.2em">
								{movie?.title}
							</Text>
							<Flex mt={1} color="gray.400">
								<Box mr={4}>
									<Rating rating={movie?.vote_average} />
								</Box>
								<Text mr={4}>{movie?.release_date && new Date(movie.release_date).getFullYear()}</Text>
								<Text mr={4} isTruncated>
									{runtime.getHours() ? `${runtime.getHours()}h` : ""} {runtime.getMinutes() ? `${runtime.getMinutes()}min` : ""}
								</Text>
							</Flex>
							<Text mb={4} color="gray.400">
								{movie?.genres.map(({ name }: any) => name).join(" | ")}
							</Text>
							<Text display={{ base: "none", md: "-webkit-box" }} noOfLines={{ md: 3 }}>
								{movie?.overview}
							</Text>
						</Box>
					</Box>
				</Box>
			</Box>
			<Divider />
			<Box mx="auto" mt={1} maxW={["95%", "95%", "90%", "85%"]}>
				<Tabs align="center" isFitted borderBottomColor="transparent" colorScheme="white" isLazy>
					<TabList>
						<Tab _focus={{ boxShadow: "none" }}>
							<Heading size="md" fontWeight={400}>
								OVERVIEW
							</Heading>
						</Tab>
						<Tab _focus={{ boxShadow: "none" }} mx={6}>
							<Heading size="md" fontWeight={400}>
								VIDEOS
							</Heading>
						</Tab>
						<Tab _focus={{ boxShadow: "none" }}>
							<Heading size="md" fontWeight={400}>
								TORRENTS
							</Heading>
						</Tab>
					</TabList>
					<TabPanels>
						<TabPanel textAlign="start">
							<Flex style={{ gap: "3em" }} mt={5}>
								<Box display={{ base: "none", lg: "block" }} minWidth="30%" rounded="lg" overflow="hidden">
									<LoadingImage imagePath={movie?.poster_path} sizes={[92, 154, 185, 342, 500, 780]} />
								</Box>
								<Box alignSelf="end">
									<Heading size="lg" fontWeight={400}>
										Storyline
									</Heading>
									<Text mt={4}>{movie?.overview}</Text>
									<Text mt={3}>{movie?.tagline}</Text>
									<Grid
										mt={6}
										templateColumns="min-content auto"
										columnGap={10}
										rowGap={2}
										overflowWrap="-moz-initial"
										templateRows="repeat(9, auto)"
									>
										<Text>Released</Text>
										<Text>{movie?.release_date}</Text>
										<Text>Runtime</Text>
										<Text>
											{runtime.getHours() ? `${runtime.getHours()}h` : ""} {runtime.getMinutes() ? `${runtime.getMinutes()}min` : ""}
										</Text>
										<Text>Budget</Text>
										<Text>{formatter.format(movie?.budget || 0)}</Text>
										<Text>Revenue</Text>
										<Text>{formatter.format(movie?.revenue || 0)}</Text>
										<Text>Genre</Text>
										<Text>{movie?.genres.map(({ name }: any) => name).join(", ")}</Text>
										<Text>Status</Text>
										<Text>{movie?.status}</Text>
										<Text>Languages</Text>
										<Text>{movie?.spoken_languages.map(({ name }: any) => name).join(", ")}</Text>
										<Text>Production</Text>
										<Text>{movie?.production_companies.map(({ name }: any) => name).join(", ")}</Text>
									</Grid>
								</Box>
							</Flex>
						</TabPanel>
						<TabPanel>{movie?.id && <Videos id={movie?.id} type="movie" />}</TabPanel>
						<TabPanel>
							<p>three!</p>
						</TabPanel>
					</TabPanels>
				</Tabs>
			</Box>
		</Box>
	);
};

const formatter = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
	maximumFractionDigits: 0,
	minimumFractionDigits: 0,
});
