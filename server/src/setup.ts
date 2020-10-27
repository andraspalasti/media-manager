import { ContextType } from "./types";
import fetch from "node-fetch";
import { MovieGenre } from "./entities/movieGenre";

export default async function ({ db }: ContextType) {
	const { genres } = await fetch(`${process.env.BASE_URL}/genre/movie/list?api_key=${process.env.API_KEY}&language=en-US`).then((response) =>
		response.json()
	);
	await db.insert().into(MovieGenre).values(genres).execute();
}
