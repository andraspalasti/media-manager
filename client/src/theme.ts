import { DefaultTheme, theme } from "@chakra-ui/core";

export const customTheme = {
	icons: {
		// Add Chakra's icons
		...theme.icons,
	},
} as DefaultTheme;
