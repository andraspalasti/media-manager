import { Box, Flex, Badge } from "@chakra-ui/react";
import React, { useState } from "react";
import { LoadingImage } from "./LoadingImage";
import { Rating } from "./Rating";

interface MediaCardProps {
	id: number;
	title: string;
	imgPath: string | undefined;
	genres: string[];
	rating: number;
	onClick?: (id: number, title: string) => void;
}

export const MediaCard: React.FC<MediaCardProps> = ({ id, title, imgPath, genres, rating, onClick }) => {
	const [mouseOver, handleMouseOver] = useState(false);
	return (
		<Box
			position="relative"
			overflow="hidden"
			onMouseOver={() => handleMouseOver(true)}
			onMouseOut={() => handleMouseOver(false)}
			rounded="md"
			{...(onClick && { onClick: () => onClick(id, title) })}
		>
			<Box width="100%" height={{ base: 300, md: 350 }}>
				<LoadingImage imagePath={imgPath || ""} sizes={[92, 154, 185, 342, 500, 780]} />
			</Box>
			<Box
				position="absolute"
				zIndex={1}
				px={2}
				width="100%"
				bottom={0}
				style={{ backdropFilter: "contrast(4) blur(20px)", background: "rgba(0,0,0,0.4)" }}
				borderBottomRadius="md"
			>
				<Box mt={1} fontWeight="semibold" as="h3" fontSize="md" color="white" isTruncated>
					{title}
				</Box>
				<Rating rating={rating} />
				{genres && (
					<Flex maxHeight="1.4em" mb={2} transition="all ease-in-out 400ms" {...(mouseOver && { maxHeight: "170px" })} wrap="wrap" overflow="hidden">
						{genres.map((genre) => (
							<Badge colorScheme="blue" key={genre} mr={2} mt={1}>
								{genre}
							</Badge>
						))}
					</Flex>
				)}
			</Box>
		</Box>
	);
};
