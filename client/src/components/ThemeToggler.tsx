import { IconButton, useColorMode } from "@chakra-ui/core";
import React from "react";

function ThemeToggler() {
	const { colorMode, toggleColorMode } = useColorMode();

	return <IconButton aria-label="" onClick={toggleColorMode} icon={colorMode === "dark" ? "moon" : "sun"} />;
}

export default ThemeToggler;
