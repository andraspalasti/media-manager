import { Cookie } from "puppeteer";

let cookies: Cookie[];

export const getCookies = () => {
	return cookies;
};

export const updateCookies = (_cookies: Cookie[]) => {
	cookies = _cookies;
};
