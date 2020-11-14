import { Box, Flex, Badge, DarkMode, PseudoBox } from "@chakra-ui/core";
import React from "react";
import LoadingImage from "./LoadingImage";
import Rating from "./Rating";

interface MediaCardProps {
	id: number;
	title: string;
	imgPath: string | undefined;
	genres: string[];
	rating: number;
	handleClick?: (id: number, title: string) => void;
}

function MediaCard({ id, title, imgPath, genres, rating, handleClick }: MediaCardProps) {
	return (
		<Box position="relative" rounded="md" overflow="hidden" {...(handleClick && { onClick: () => handleClick(id, title) })}>
			<Box width="100%" height={{ base: 300, md: 350 }}>
				<LoadingImage imagePath={imgPath || ""} sizes={[92, 154, 185, 342, 500, 780]} />
			</Box>
			<Box
				position="absolute"
				zIndex={5}
				px={2}
				width="100%"
				bottom={0}
				style={{ backdropFilter: "contrast(4) blur(20px)", background: "rgba(0,0,0,0.4)" }}
			>
				<Box mt={1} fontWeight="semibold" as="h3" fontSize="md" color="white" isTruncated>
					{title}
				</Box>
				<Rating rating={rating} />
				{genres && (
					<PseudoBox maxHeight="18px" mb={2} transition="all ease-in-out 200ms" _hover={{ maxHeight: "50px" }}>
						<Flex wrap="wrap" overflow="hidden">
							<DarkMode>
								{genres.map((genre) => (
									<Badge variantColor="blue" key={genre} mr={2} mt={1}>
										{genre}
									</Badge>
								))}
							</DarkMode>
						</Flex>
					</PseudoBox>
				)}
			</Box>
		</Box>
	);
}

export default MediaCard;
