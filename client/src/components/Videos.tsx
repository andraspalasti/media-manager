import { gql, useQuery } from "@apollo/client";
import { Box, Center, Flex, Text, Image, Spinner, Modal, ModalOverlay, useDisclosure, ModalContent } from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import React, { useState } from "react";

export default function Videos({ id, type }: { id: number; type: "movie" | "tv" }) {
	const { loading, error, data } = useQuery(GET_VIDEOS, {
		variables: { id: Number(id), type },
	});
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [selectedVideo, selectVideo] = useState("");

	if (loading)
		return (
			<Center width="100%">
				<Spinner size="xl" />
			</Center>
		);
	if (error) {
		console.error(error);
		return <div>No videos found</div>;
	}
	const videos: Video[] = data.getVideos?.results.filter(({ site }: Video) => site === "YouTube");
	if (videos.length === 0) {
		<Center width="100%">No videos found</Center>;
	}

	return (
		<Box mx="auto">
			<Modal isCentered isOpen={isOpen} onClose={onClose} motionPreset="scale">
				<ModalOverlay />
				<ModalContent>
					<Box position="relative" pb="56.25%" height={0}>
						<iframe
							title={selectedVideo}
							style={{ position: "absolute", top: 0, left: 0 }}
							height="100%"
							width="100%"
							src={`https://www.youtube.com/embed/${selectedVideo}`}
						></iframe>
					</Box>
				</ModalContent>
			</Modal>
			<Flex wrap="wrap" justifyContent="flex-start">
				{videos.map(({ key, name, site, type }) => {
					return (
						<VideoElement
							key={key}
							id={key}
							name={name}
							site={site}
							type={type}
							onClick={(id) => {
								onOpen();
								selectVideo(id);
							}}
						/>
					);
				})}
			</Flex>
		</Box>
	);
}

function VideoElement({ id, name, site, type, onClick }: Props) {
	const [mouseOver, handleMouseOver] = useState(false);
	return (
		<Box
			textAlign="left"
			p={2}
			mb={2}
			onMouseOver={() => handleMouseOver(true)}
			onMouseOut={() => handleMouseOver(false)}
			width={{ base: "100%", md: "33.333%", lg: "25%" }}
			_hover={{ cursor: "pointer" }}
			{...(onClick && { onClick: () => onClick(id) })}
		>
			<Box position="relative" rounded="sm" overflow="hidden">
				<Flex
					width="100%"
					height="100%"
					transition="all ease-in 200ms"
					background="rgba(0, 0, 0, 0.4)"
					opacity={0}
					{...(mouseOver && { opacity: 1 })}
					position="absolute"
					justifyContent="center"
					alignItems="center"
				>
					<ChevronRightIcon w={10} h={10} rounded="full" border="2px solid" color="gray.300" />
				</Flex>
				<Image minW={0} minH={0} src={`https://img.youtube.com/vi/${id}/mqdefault.jpg`} />
			</Box>
			<Text fontSize="lg" fontWeight={500} color="gray.300" isTruncated>
				{name}
			</Text>
			<Text color="gray.500">{type}</Text>
		</Box>
	);
}

const GET_VIDEOS = gql`
	query getVideos($id: Float!, $type: String!) {
		getVideos(id: $id, type: $type) {
			id
			results {
				name
				key
				site
				type
			}
		}
	}
`;

interface Props {
	id: string;
	name: string;
	site: string;
	type: string;
	onClick?: (id: string) => void;
}

interface Video {
	key: string;
	name: string;
	site: string;
	type: string;
}
