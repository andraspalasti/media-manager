import { Badge, Box, Button, Flex, Icon, Text } from "@chakra-ui/core";
import React from "react";
import LoadingImage from "./LoadingImage";

interface MediaRowProps {
	id: number;
	title: string;
	releaseDate: Date;
	genres: string[];
	imagePath: string;
	rating: number;
	handleClick?: (id: number, title: string) => void;
}

export default function MediaRow({ id, title, releaseDate, imagePath, rating, genres, handleClick }: MediaRowProps) {
	return (
		<Button whiteSpace="normal" variant="outline" height={160} {...(handleClick && { onClick: () => handleClick(id, title) })}>
			<Flex width="100%" alignItems="center">
				<Box height={138} width={92} flexShrink={0} rounded="lg" shadow="lg" overflow="hidden" mr={6}>
					<LoadingImage imagePath={imagePath} sizes={[92, 154, 185, 342, 500, 780]} />
				</Box>
				<Box maxHeight={123} overflowY="hidden" width="auto" flexGrow={2} textAlign="start">
					<Text fontWeight="medium" as="h3" fontSize="lg" lineHeight="tight">
						{title}
					</Text>
					<Flex mt={3} color="orange.300" alignItems="center">
						<Text mr={5} color="gray.400">
							{releaseDate}
						</Text>
						<Icon name="star" lineHeight={1} mr={1} />
						<Text>{rating}</Text>
					</Flex>
					<Flex mt={3} alignItems="center" flexWrap="wrap" alignContent="space-around" overflow="hidden">
						{genres &&
							genres.map((val) => (
								<Badge variantColor="blue" key={val} p={1} mt={1} mr={2}>
									{val}
								</Badge>
							))}
					</Flex>
				</Box>
			</Flex>
		</Button>
	);
}
