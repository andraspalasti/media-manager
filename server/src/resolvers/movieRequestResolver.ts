import { Resolver, FieldResolver, Ctx, Root, Query, Arg } from "type-graphql";
import { MovieGenre } from "../entities/movieGenre";
import { MovieRequest, MovieResponse } from "../schemas/movieRequest";
import { ContextType } from "../types";
import fetch from "node-fetch";

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
		const result = await db.find(MovieGenre, { id: { $in: genre_ids } }, { fields: ["name"], cache: 10000 });
		const genres = result.map((genre) => {
			return genre.name;
		});
		return genres;
	}

	@Query(() => MovieResponse)
	async trendingMovies() {
		return await fetch(`${process.env.BASE_URL}/trending/movie/week?api_key=${process.env.API_KEY}`).then((response) => response.json());
	}
}
