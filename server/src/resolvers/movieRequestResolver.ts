import { Resolver, FieldResolver, Ctx, Root, Query, Arg } from "type-graphql";
import { MovieGenre } from "../entities/movieGenre";
import { MovieRequest, MovieResponse } from "../schemas/movieRequest";
import { ContextType } from "../types";
import fetch from "node-fetch";
import { In } from "typeorm";

@Resolver(MovieRequest)
export class MovieRequestResolver {
	@Query(() => MovieResponse)
	async searchMovie(@Arg("title") title: string): Promise<MovieResponse> {
		return await fetch(`${process.env.BASE_URL}/search/movie?api_key=${process.env.API_KEY}&query=${title}&include_adult=false`).then((response) =>
			response.json()
		);
	}

	@FieldResolver(() => [String])
	async genres(@Root() { genre_ids }: MovieRequest, @Ctx() { db }: ContextType) {
		const result = await db.getRepository(MovieGenre).find({ cache: 30000, order: { id: "ASC" } });
		const genres: String[] = [];
		genre_ids.forEach((id) => {
			const genre = binarySearchGenres(result, id);
			if (genre !== "-1") {
				genres.push(genre);
			}
		});
		return genres;
	}

	@Query(() => MovieResponse)
	async trendingMovies() {
		return await fetch(`${process.env.BASE_URL}/trending/movie/week?api_key=${process.env.API_KEY}`).then((response) => response.json());
	}
}

function binarySearchGenres(arr: MovieGenre[], id: number): string {
	var mid = Math.floor(arr.length / 2);
	if (arr[mid].id === id) {
		return arr[mid].name;
	} else if (arr[mid].id < id && arr.length > 1) {
		return binarySearchGenres(arr.splice(mid, Number.MAX_VALUE), id);
	} else if (arr[mid].id > id && arr.length > 1) {
		return binarySearchGenres(arr.splice(0, mid), id);
	} else {
		return "-1";
	}
}
