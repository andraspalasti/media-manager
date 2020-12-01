import { ContextType } from "./types";
import fetch from "node-fetch";
import { MovieGenre } from "./entities/movieGenre";
import { getCookies, updateCookies } from "./cookies";

export default async function ({ db, browser }: ContextType) {
	const { genres } = await fetch(`${process.env.BASE_URL}/genre/movie/list?api_key=${process.env.API_KEY}&language=en-US`).then((response) =>
		response.json()
	);
	await db.createQueryBuilder().insert().into(MovieGenre).values(genres).orIgnore().execute();
	const page = await browser.newPage();
	await page.goto(process.env.TORRENT_SITE!, { waitUntil: "load", timeout: 60000 }).catch((error) => new Error(error));

	// Signing in and navigating to downloads page
	await page.type("input#loginform_username", process.env.USER_ID!);
	await page.type("input#loginform_password", process.env.PASSWORD!);
	await page.click("#loginform > table > tbody > tr:nth-child(3) > td:nth-child(2) > input[type=checkbox]");
	await page.click("#loginform_submit");
	await page.waitForSelector("div#logoholderdiv");
	updateCookies(await page.cookies());
	await page.close();
}
