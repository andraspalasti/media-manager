import { ContextType } from "./types";
import fetch from "node-fetch";
import { MovieGenre } from "./entities/movieGenre";

const baseUrl = "https://bithumen.be/";
const userName = "nyuszis";
const password = "anita";

export default async function ({ db, browser }: ContextType) {
	const result = await fetch(`${process.env.BASE_URL}/genre/movie/list?api_key=${process.env.API_KEY}&language=en-US`).then((response) =>
		response.json()
	);
	const genres = result.genres.map((genre: any) => Object.assign(new MovieGenre(), genre));
	db.getRepository(MovieGenre).persistAndFlush(genres);
	// (await db.getRepository(MovieGenre).nativeInsert()
	// await db
	// 	.persist(genres)
	// 	.flush()
	// 	.catch((e) => console.error(e));
	// db.merge(MovieGenre)
	// db.nativeInsert(MovieGenre, genres).catch((e) => console.error(e));

	const page = await browser.newPage();
	await page.goto(baseUrl, { waitUntil: "load", timeout: 60000 }).catch((error) => new Error(error));
	// Signing in and navigating to downloads page
	await page.type("input#loginform_username", userName);
	await page.type("input#loginform_password", password);
	// await page.click("#loginform_submit");
	// await page.waitForSelector("div#logoholderdiv");
}
