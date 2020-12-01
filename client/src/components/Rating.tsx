import { Flex, Text } from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";
import React from "react";

interface RatingProps {
	rating: number | undefined;
}

const Rating: React.FC<RatingProps> = ({ rating }) => {
	return (
		<Flex alignItems="center" flexWrap="nowrap" overflow="hidden">
			{Array.apply(null, Array(5)).map((_, i) => {
				return i < Math.round((rating || 0) / 2) ? (
					<StarIcon color="orange.300" key={i} fontSize="sm" mr={1} />
				) : (
					<StarIcon stroke="orange.300" key={i} color="transparent" fontSize="sm" mr={1} />
				);
			})}

			<Text color="orange.300" fontSize={16} fontWeight={500} ml={1}>
				{rating}
			</Text>
		</Flex>
	);
};

export default Rating;
