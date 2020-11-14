import { Flex, Icon, Text } from "@chakra-ui/core";
import React from "react";

interface RatingProps {
	rating: number;
}

export default function Rating(props: RatingProps) {
	const { rating } = props;
	return (
		<Flex alignItems="center" flexWrap="nowrap" overflow="hidden">
			{Array.apply(null, Array(5)).map((_, i) => {
				return i < Math.round(rating / 2) ? (
					<Icon name="star" color="orange.300" key={i} fontSize="sm" mr={1} />
				) : (
					<Icon name="star" stroke="orange.300" key={i} color="transparent" fontSize="sm" mr={1} />
				);
			})}

			<Text color="orange.300" fontSize={16} fontWeight={500} ml={1}>
				{rating}
			</Text>
		</Flex>
	);
}
