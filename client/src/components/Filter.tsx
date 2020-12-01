import { Button } from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";
import React from "react";

interface FilterProps {
	name: string;
	colorScheme: string;
	active: boolean;
	onClick?: () => void | undefined;
}

const Filter: React.FC<FilterProps> = ({ name, onClick, colorScheme, active }) => {
	return (
		<Button variant="outline" rounded="xl" border="2px" _focus={{ outline: "none" }} {...(active && { colorScheme })} {...(onClick && { onClick })}>
			<CheckIcon transition="all ease-in-out 300ms" color={`${colorScheme}.200`} maxW={0} {...(active && { maxW: 10, mr: 2 })} />
			{name}
		</Button>
	);
};

export default Filter;
