import { ContextType } from "./types";
import fetch from "node-fetch";
import { MovieGenre } from "./entities/movieGenre";

export default async function ({ db }: ContextType) {
	const result = await fetch(`${process.env.BASE_URL}/genre/movie/list?api_key=${process.env.API_KEY}&language=en-US`).then((response) =>
		response.json()
	);
	const genres = result.genres.map((genre: any) => Object.assign(new MovieGenre(), genre));
	await db.persistAndFlush(genres);
}
