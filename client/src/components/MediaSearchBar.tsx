import { Box, Collapse, Icon, Input, InputGroup, InputLeftElement, useColorMode } from "@chakra-ui/core";
import React, { useState } from "react";
import MovieSearch from "./MovieSearch";

export default function MediaSearchBar() {
	const { colorMode } = useColorMode();
	const [show, setShow] = useState(false);
	const [title, setTitle] = useState("");
	const backgrounds = { light: "white", dark: "gray.700" };

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTitle(e.target.value);
		if (e.target.value !== "") {
			setShow(true);
		} else {
			setShow(false);
		}
	};

	return (
		<Box position="relative">
			<InputGroup
				// rounded="lg"
				// overflow="hidden"
				zIndex={10}
				onFocus={() => title && setShow(true)}
				// onBlur={() => setShow(false)}
			>
				<InputLeftElement children={<Icon name="search" />} />
				<Input rounded="lg" value={title} type="text" placeholder="Search for movie or tv-show" onChange={handleChange} />
			</InputGroup>
			<Box position="absolute" zIndex={9} width="100%">
				<Collapse width="100%" shadow="0 10px 15px -3px rgba(0,0,0,0.4)" backgroundColor={backgrounds[colorMode]} rounded="lg" isOpen={show} p={3}>
					{title && <MovieSearch title={title} />}
				</Collapse>
			</Box>
		</Box>
	);
}
