import { ContextType } from "./types";
import fetch from "node-fetch";
import { MovieGenre } from "./entities/movieGenre";

const baseUrl = "https://bithumen.be/";
const userName = "nyuszis";
const password = "anita";

export default async function ({ db, browser }: ContextType) {
	const { genres } = await fetch(`${process.env.BASE_URL}/genre/movie/list?api_key=${process.env.API_KEY}&language=en-US`).then((response) =>
		response.json()
	);
	await db.createQueryBuilder().insert().into(MovieGenre).values(genres).orIgnore().execute();
	const page = await browser.newPage();
	await page.goto(baseUrl, { waitUntil: "load", timeout: 60000 }).catch((error) => new Error(error));

	// Signing in and navigating to downloads page
	await page.type("input#loginform_username", userName);
	await page.type("input#loginform_password", password);
	// await page.click("#loginform_submit");
	// await page.waitForSelector("div#logoholderdiv");
}
