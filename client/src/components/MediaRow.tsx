import { Box, BoxProps, Flex, Text } from "@chakra-ui/react";
import React from "react";
import LoadingImage from "./LoadingImage";
import Rating from "./Rating";

interface MediaRowProps extends BoxProps {
	id: string;
	title: string;
	releaseDate: Date;
	imagePath: string | undefined | null;
	rating: number;
}

const MediaRow: React.FC<MediaRowProps> = ({ id, title, releaseDate, imagePath, rating, ...rest }) => {
	return (
		<Box
			whiteSpace="normal"
			background="gray.800"
			boxShadow="xl"
			rounded="lg"
			transition="all ease-in-out 300ms"
			_hover={{ bgColor: "gray.700", cursor: "pointer" }}
			{...rest}
		>
			<Flex position="relative" width="100%" p={0} height="100%" overflow="hidden" rounded="lg" alignItems="center">
				<Box height={138} width={92} flexShrink={0} rounded="lg" overflow="hidden" mr={6}>
					<LoadingImage imagePath={imagePath} sizes={[92, 154, 185, 342, 500, 780]} />
				</Box>
				<Box maxHeight={123} overflowY="hidden" pr={4} width="auto" flexGrow={2} textAlign="start">
					<Text fontWeight="small" noOfLines={2} mb={1} fontSize="xl">
						{title}
						<span style={{ color: "#718096" }}> ({!isNaN(releaseDate.valueOf()) && releaseDate.getFullYear()})</span>
					</Text>
					<Rating rating={rating} />
				</Box>
			</Flex>
		</Box>
	);
};

export default MediaRow;
