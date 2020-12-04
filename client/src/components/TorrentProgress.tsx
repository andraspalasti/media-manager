import { DownloadIcon, DeleteIcon } from "@chakra-ui/icons";
import { Box, Flex, Menu, MenuButton, MenuItem, MenuList, Progress, Skeleton, Text } from "@chakra-ui/react";
import React from "react";
import { formatBytes, formatSeconds } from "../utils";
import { OnTorrentProgressDocument, useTorrentProgressQuery, useDeleteTorrentMutation } from "../generated/graphql";
import { motion } from "framer-motion";

interface TorrentProgressProps {
	torrentId: string;
	title: string;
	size: number;
	refresh: () => void | undefined;
}

const TorrentProgress: React.FC<TorrentProgressProps> = ({ torrentId, title, size, refresh }) => {
	const { subscribeToMore, data, loading } = useTorrentProgressQuery({ variables: { torrentId } });
	const [deleteTorrent, deleteT] = useDeleteTorrentMutation({ onCompleted: () => refresh && refresh() });
	subscribeToMore({
		document: OnTorrentProgressDocument,
		variables: { torrentId },
		updateQuery: (_prev, { subscriptionData }) => {
			return { torrentProgress: subscriptionData.data.torrentProgress };
		},
	});
	if (loading || deleteT.loading) {
		return (
			<Box height="100px" width={{ base: "100%", md: "50%", lg: "50%", xl: "33.33%" }} p={3}>
				<Box p={3} shadow="lg" rounded="lg" border="2px solid" borderColor="gray.700">
					<Skeleton ml="auto" width="60%" height="19px" mb={2} rounded="lg" />
					<Skeleton ml="auto" width="70%" height="19px" mt={2} rounded="lg" />
				</Box>
			</Box>
		);
	}
	if (refresh && data?.torrentProgress.progress === 1) {
		refresh();
	}
	return (
		<Box height="100px" w={{ base: "100%", md: "50%", lg: "50%", xl: "33.33%" }} p={3}>
			<Menu placement="bottom-end" autoSelect={false}>
				<MenuButton w="100%" _hover={{ bg: "blue.900" }} border="2px solid" borderColor="blue.900" rounded="lg" overflow="hidden" shadow="xl">
					<Flex width="100%" justifyContent="space-between" alignItems="center" p={3} pb={1}>
						<motion.div animate={{ translateY: [2, -10, 2] }} transition={{ repeat: Infinity, type: "spring", duration: 2 }}>
							<DownloadIcon fontSize="2xl" m={2} color="blue.400" />
						</motion.div>
						<Box textAlign="right">
							<Text isTruncated>{title}</Text>
							<Flex justifyContent="space-between">
								<Text color="gray.400" mr={2}>
									{data?.torrentProgress.timeRemaining !== "Infinity"
										? formatSeconds(Number(data?.torrentProgress.timeRemaining) / 1000 || 0)
										: "Unknown"}
								</Text>
								<Text color="gray.400" mr={2}>
									{formatBytes(data?.torrentProgress.downloaded || 0)}/{formatBytes(size)}
								</Text>
								<Text color="gray.400" mr={0}>
									{formatBytes(data?.torrentProgress.downloadSpeed || 0)}/s
								</Text>
							</Flex>
						</Box>
					</Flex>
					<Progress width="100%" size="xs" value={(data?.torrentProgress.progress || 0) * 100} />
				</MenuButton>
				<MenuList>
					<MenuItem onClick={() => deleteTorrent({ variables: { torrentId } }).catch()}>
						<DeleteIcon mr={2} />
						Delete
					</MenuItem>
				</MenuList>
			</Menu>
		</Box>
	);
};

export default TorrentProgress;
