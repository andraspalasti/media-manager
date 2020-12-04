import {
	Box,
	Center,
	Flex,
	Text,
	Image,
	Spinner,
	Modal,
	ModalOverlay,
	useDisclosure,
	ModalContent,
	Alert,
	AlertDescription,
	AlertIcon,
	AlertTitle,
	BoxProps,
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import React, { useState } from "react";
import { useVideosQuery } from "../generated/graphql";

interface VideosProps {
	id: string;
	type: "movie" | "tv";
}

const Videos: React.FC<VideosProps> = ({ id, type }) => {
	const { loading, error, data } = useVideosQuery({ variables: { id: id, type } });
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [selectedVideo, selectVideo] = useState("");

	if (loading)
		return (
			<Center height="100%" width="100%">
				<Spinner size="xl" />
			</Center>
		);

	if (error) {
		console.error(error);
		return (
			<Alert rounded="lg" status="error" variant="top-accent" flexDirection="column" p={3} justifyContent="center" textAlign="center">
				<AlertIcon w="40px" h="40px" mr={0} />
				<AlertTitle mt={4} mb={1} fontSize="lg">
					Ooops...
				</AlertTitle>
				<AlertDescription maxWidth="sm">No videos found</AlertDescription>
			</Alert>
		);
	}

	const videos = data?.getVideos?.results.filter(({ site }) => site === "YouTube");
	if (videos?.length === 0) {
		return (
			<Center height="30vh" width="100%">
				<Text fontSize="2xl">No videos found</Text>
			</Center>
		);
	}

	return (
		<Box mx="auto">
			<Modal isCentered isOpen={isOpen} onClose={onClose} size="4xl" motionPreset="scale">
				<ModalOverlay />
				<ModalContent>
					<Box position="relative" pb="56.25%" height={0}>
						<iframe
							title={selectedVideo}
							style={{ position: "absolute", top: 0, left: 0 }}
							height="100%"
							width="100%"
							src={`https://www.youtube.com/embed/${selectedVideo}`}
							frameBorder="0"
							allowFullScreen
						></iframe>
					</Box>
				</ModalContent>
			</Modal>
			<Flex wrap="wrap" justifyContent="flex-start">
				{videos &&
					videos.map(({ key, name, type }) => {
						return (
							<VideoElement
								key={key}
								id={key}
								name={name}
								type={type}
								onClick={() => {
									onOpen();
									selectVideo(key);
								}}
							/>
						);
					})}
			</Flex>
		</Box>
	);
};

interface VideoElementProps extends BoxProps {
	id: string;
	name: string;
	type: string;
}

const VideoElement: React.FC<VideoElementProps> = ({ id, name, type, ...rest }) => {
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
			{...rest}
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
				<Image minW={0} mx="auto" minH={0} src={`https://img.youtube.com/vi/${id}/mqdefault.jpg`} />
			</Box>
			<Text fontSize="lg" fontWeight={500} color="gray.300" isTruncated>
				{name}
			</Text>
			<Text color="gray.500">{type}</Text>
		</Box>
	);
};

export default Videos;
