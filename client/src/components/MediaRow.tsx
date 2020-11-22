import { Badge, Box, Button, Flex, Text } from "@chakra-ui/react";
import React from "react";
import LoadingImage from "./LoadingImage";
import Rating from "./Rating";

interface MediaRowProps {
	id: number;
	title: string;
	releaseDate: Date;
	genres: string[];
	imagePath: string;
	rating: number;
	onClick?: (id: number, title: string) => void;
}

export default function MediaRow({ id, title, releaseDate, imagePath, rating, genres, onClick }: MediaRowProps) {
	console.log(releaseDate);

	return (
		<Button whiteSpace="normal" variant="outline" height={160} {...(onClick && { onClick: () => onClick(id, title) })}>
			<Flex position="relative" width="100%" overflow="hidden" rounded="lg" alignItems="center">
				<Box height={138} width={92} flexShrink={0} rounded="lg" shadow="lg" overflow="hidden" mr={6}>
					<LoadingImage imagePath={imagePath} sizes={[92, 154, 185, 342, 500, 780]} />
				</Box>
				<Box maxHeight={123} overflowY="hidden" width="auto" flexGrow={2} textAlign="start">
					<Text fontWeight="medium" mb={1} as="h3" fontSize="lg" lineHeight="tight">
						{title}
					</Text>
					<Rating rating={rating} />
					<Flex mt={1} alignItems="center" flexWrap="wrap" alignContent="space-around" overflow="hidden">
						{genres &&
							genres.map((val) => (
								<Badge colorScheme="blue" key={val} p={1} mt={1} mr={2}>
									{val}
								</Badge>
							))}
					</Flex>
					{/* <Badge position="absolute" bottom={0} left={0} p={1} variant="solid" bg="orange.300" color="black">
						TV Show
					</Badge> */}
					<Text position="absolute" right={0} bottom={0} color="gray.400" ml={1}>
						{!isNaN(releaseDate.valueOf()) && releaseDate.getFullYear()}
					</Text>
				</Box>
			</Flex>
		</Button>
	);
}
