import { Box, Button, Divider, Flex, Skeleton, Text } from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";
import { Movies, QueryMoviesArgs, useMoviesQuery } from "../generated/graphql";
import React, { useEffect, useState } from "react";
import { formatBytes, formatSeconds } from "../utils";
import TorrentProgress from "../components/TorrentProgress";
import { gql, useLazyQuery } from "@apollo/client";

const Torrents: React.FC = () => {
	return (
		<Box maxW={["95%", "95%", "95%", "90%"]} mx="auto">
			<DownloadingMovies />
		</Box>
	);
};

const DownloadingMovies: React.FC = () => {
	const [getOngoingTorrents, { loading, data }] = useLazyQuery<{ movies: Partial<Movies> }, QueryMoviesArgs>(DOWNLOADING_MOVIES, {
		variables: { completed: false },
		fetchPolicy: "network-only",
	});
	useEffect(() => getOngoingTorrents(), [getOngoingTorrents]);
	if (loading) {
		return (
			<Box>
				<Skeleton>
					<Text fontSize="xl">There are no movies downloading at the moment</Text>
				</Skeleton>
				<Divider />
				<DownloadedMovies />
			</Box>
		);
	}
	if (data?.movies.movies?.length === 0) {
		return (
			<Box>
				<Text fontSize="xl">There are no movies downloading at the moment</Text>
				<Divider borderColor="gray.500" />
				<DownloadedMovies />
			</Box>
		);
	}
	return (
		<Box>
			<Text fontSize="xl">
				Downloading movies
				<span style={{ color: "#718096" }}>({data?.movies.movies?.length})</span>
			</Text>
			<Divider w="100%" borderColor="gray.500" />
			<Flex w="100%" wrap="wrap">
				{data?.movies.movies?.map(({ torrentId, title, size }) => (
					<TorrentProgress key={torrentId} torrentId={torrentId} refresh={() => getOngoingTorrents()} title={title} size={size} />
				))}
			</Flex>
			<DownloadedMovies />
		</Box>
	);
};

const DownloadedMovies: React.FC = () => {
	const [offset, setOffset] = useState(0);
	const { data, loading, fetchMore } = useMoviesQuery({ variables: { completed: true, limit: 2, offset }, fetchPolicy: "network-only" });
	if (data?.movies.movies.length === 0) {
		return (
			<Text mt={20} fontSize="xl">
				There are no movies downloaded yet.
			</Text>
		);
	}
	return (
		<Box mt={20}>
			<Skeleton isLoaded={!loading}>
				<Text fontSize="xl">
					Last downloaded movies <span style={{ color: "#718096" }}>({data?.movies.length})</span>
				</Text>
			</Skeleton>
			<Divider borderColor="gray.500" />
			<Flex w="100%" wrap="wrap">
				{data?.movies.movies.map(({ title, addedAt, finishedAt, size }) => {
					const downloadTime = (new Date(finishedAt).getTime() - new Date(addedAt).getTime()) / 1000;
					return (
						<Box h="100px" w={{ base: "100%", md: "50%", lg: "50%", xl: "33.33%" }} p={3} key={title}>
							<Flex justifyContent="space-between" border="2px solid" borderColor="green.900" rounded="lg" p={3} alignItems="center" shadow="lg">
								<CheckIcon fontSize="xl" m={2} color="green.400" />
								<Box textAlign="right">
									<Text isTruncated>{title}</Text>
									<Flex justifyContent="space-between">
										<Text color="gray.400" mr={2}>
											Downloaded in: {formatSeconds(downloadTime).replace(/\s\d*s/gi, "")}
										</Text>
										<Text color="gray.400">Size: {formatBytes(size)}</Text>
									</Flex>
								</Box>
							</Flex>
						</Box>
					);
				})}
				{loading &&
					[...Array(2)].map((_, i) => (
						<Box h="100px" key={i} w={{ base: "100%", md: "50%", lg: "50%", xl: "33.33%" }} p={3}>
							<Box p={3} shadow="lg" rounded="lg" border="2px solid" borderColor="gray.700">
								<Skeleton ml="auto" width="60%" height="19px" mb={2} rounded="lg" />
								<Skeleton ml="auto" width="70%" height="19px" mt={2} rounded="lg" />
							</Box>
						</Box>
					))}
				{!loading && data?.movies.movies.length !== data?.movies.length && (
					<Box height="100px" p={3} width={{ base: "100%", md: "50%", lg: "50%", xl: "33.33%" }}>
						<Button
							w="100%"
							h="100%"
							variant="outline"
							colorScheme="green"
							shadow="lg"
							border="2px solid"
							borderColor="green.900"
							color="green.500"
							rounded="lg"
							onClick={() => {
								fetchMore({ variables: { completed: true, limit: 2, offset: offset + 2 } });
								setOffset(offset + 2);
							}}
						>
							Show more...
						</Button>
					</Box>
				)}
			</Flex>
		</Box>
	);
};

const DOWNLOADING_MOVIES = gql`
	query movies($completed: Boolean, $offset: Int, $limit: Int) {
		movies(completed: $completed, offset: $offset, limit: $limit) {
			movies {
				torrentId
				title
				size
			}
		}
	}
`;

export default Torrents;
