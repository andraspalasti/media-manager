import { DownloadIcon, SearchIcon, CloseIcon } from "@chakra-ui/icons";
import {
	Alert,
	AlertDescription,
	AlertIcon,
	AlertTitle,
	Badge,
	Box,
	Button,
	Center,
	Flex,
	IconButton,
	IconButtonProps,
	Input,
	InputGroup,
	InputLeftElement,
	InputRightElement,
	Spinner,
	Text,
} from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import React, { useMemo, useState } from "react";
import { useDownloadTorrentMutation, Torrent, useTorrentsQuery } from "../generated/graphql";
import Filter from "./Filter";

interface DownloadableTorrentsProps {
	title: string;
	movieId: string;
}

const DownloadableTorrents: React.FC<DownloadableTorrentsProps> = ({ title, movieId }) => {
	const { loading, data, error } = useTorrentsQuery({ variables: { title } });
	const [downloadTorrent, response] = useDownloadTorrentMutation();
	const [clickedTorrent, setTorrent] = useState("");
	const [numOfItemsToShow, setNumOfItems] = useState(8);
	const [searchTitle, setSearchTitle] = useState("");
	const [filters, setFilters] = useState<{ [key: string]: boolean }>({});
	let torrents = useMemo(() => {
		return data?.getTorrents.slice().filter(({ title: torrentName }) => {
			return !searchTitle || torrentName.toLowerCase().startsWith(searchTitle.toLowerCase());
		});
	}, [data?.getTorrents, searchTitle]);
	useMemo(() => {
		let temp = {};
		if (torrents)
			for (const { type } of torrents) {
				temp = { ...temp, [type]: true };
			}
		setFilters(temp);
	}, [torrents]);
	torrents = useMemo(() => {
		return torrents?.slice().filter(({ type }) => filters[type]);
	}, [filters, torrents]);

	if (loading) {
		return (
			<Center height="30vh" width="100%">
				<Spinner size="xl" />
			</Center>
		);
	}

	if (response.data?.downloadTorrent === true) {
		return (
			<Alert rounded="lg" status="success" variant="top-accent" flexDirection="column" p={3} justifyContent="center" textAlign="center">
				<AlertIcon w="40px" h="40px" mr={0} />
				<AlertTitle mt={4} mb={1} fontSize="lg">
					You're torrent successfully started downloading
				</AlertTitle>
				<AlertDescription maxWidth="sm">You can watch it's proggress on the torrents page.</AlertDescription>
			</Alert>
		);
	}

	if (error) {
		console.error(error);
		return (
			<Alert rounded="lg" status="error" variant="top-accent" flexDirection="column" p={3} justifyContent="center" textAlign="center">
				<AlertIcon w="40px" h="40px" mr={0} />
				<AlertTitle mt={4} mb={1} fontSize="lg">
					Ooops...
				</AlertTitle>
				<AlertDescription maxWidth="sm">"There was an error with the requested data."</AlertDescription>
			</Alert>
		);
	}

	return (
		<>
			<Flex wrap="wrap" flexDirection="row">
				{data?.getTorrents.length === 0 && (
					<Center width="100%" height="30vh">
						<Text fontSize="2xl">We're sorry but we couldn't find any torrents.</Text>
					</Center>
				)}
				{data?.getTorrents.length !== 0 && torrents && (
					<Flex width="100%" wrap="wrap" px={2} mb={4}>
						<InputGroup rounded="lg" mr={6} mb={3} maxW="xl" zIndex={10}>
							<InputLeftElement children={<SearchIcon />} />
							<Input
								value={searchTitle}
								rounded="lg"
								type="text"
								onChange={(e) => {
									setSearchTitle(e.target.value);
									setNumOfItems(8);
								}}
								placeholder="Search for torrent"
							/>
							{searchTitle && (
								<InputRightElement
									onClick={() => setSearchTitle("")}
									children={
										<IconButton
											bg="transparent"
											_hover={{ bg: "transparent" }}
											_focus={{ outline: "none" }}
											icon={<CloseIcon color="gray.500" />}
											aria-label=""
										/>
									}
								/>
							)}
						</InputGroup>
						<Flex wrap="wrap">
							<AnimatePresence>
								{Object.entries(filters).map(([filter, active]) => (
									<motion.div
										initial={{ opacity: 0, translateY: -20 }}
										animate={{ opacity: 1, translateY: 0 }}
										exit={{ opacity: 0, translateY: 20 }}
										transition={{ type: "tween", duration: 0.5 }}
										key={filter}
									>
										<Box mx={1} mb={1}>
											<Filter
												name={filter}
												colorScheme="blue"
												onClick={() => {
													setFilters({ ...filters, [filter]: !active });
													setNumOfItems(8);
												}}
												active={active as boolean}
											/>
										</Box>
									</motion.div>
								))}
							</AnimatePresence>
						</Flex>
					</Flex>
				)}
				{torrents &&
					torrents
						.slice(0, numOfItemsToShow > torrents.length ? torrents.length : numOfItemsToShow)
						.map(({ title: torrentName, type, files, size, downloadLink }) => (
							<Box p={2} width={{ base: "100%", md: "50%", lg: "33.33%" }} key={torrentName}>
								<TorrentElement
									aria-label="Download button"
									isDisabled={response.loading || clickedTorrent === torrentName}
									isLoading={clickedTorrent === torrentName && response.loading}
									onClick={() => {
										downloadTorrent({ variables: { title, torrentName, downloadLink, type: "movie" } }).catch((e) => console.error(e));
										setTorrent(torrentName);
									}}
									torrent={{ title: torrentName, type, files, size, downloadLink }}
								/>
							</Box>
						))}
				{torrents && numOfItemsToShow < torrents.length && (
					<Button mx={2} mt={4} isFullWidth variant="outline" onClick={() => setNumOfItems(numOfItemsToShow + 9)} colorScheme="blue">
						Show more...
					</Button>
				)}
			</Flex>
		</>
	);
};

interface TorrentProps extends IconButtonProps {
	torrent: Pick<Torrent, "title" | "size" | "type" | "files" | "downloadLink">;
}

const TorrentElement: React.FC<TorrentProps> = ({ torrent, ...rest }) => {
	return (
		<Flex
			justifyContent="space-between"
			p={3}
			_hover={{ background: "gray.700" }}
			rounded="lg"
			alignItems="center"
			border="solid 1px"
			borderColor="gray.700"
		>
			<Box>
				<Text noOfLines={1} whiteSpace="break-spaces">
					{torrent.title.replace(/[^a-zA-Z0-9\s]/g, " ")}
				</Text>
				<Flex mt={1} alignItems="center">
					<Badge colorScheme="orange" fontSize="sm">
						{torrent.type}
					</Badge>
					<Text mx={4}>{torrent.files} files</Text>
					<Text>{torrent.size}</Text>
				</Flex>
			</Box>
			<IconButton mx={4} colorScheme="blue" {...rest} icon={<DownloadIcon />} />
		</Flex>
	);
};

export default DownloadableTorrents;
