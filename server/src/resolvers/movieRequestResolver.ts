import { Resolver, FieldResolver, Ctx, Root, Query, Arg } from "type-graphql";
import { MovieGenre } from "../entities/movieGenre";
import { MovieDetails, MovieRequest, MovieResponse } from "../schemas/movieRequest";
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
		const result = await db.getRepository(MovieGenre).find({ where: { id: In(genre_ids) }, cache: 30000 });
		const genres = result.map((genre) => genre.name);
		return genres;
	}

	@Query(() => MovieResponse)
	async trendingMovies() {
		return await fetch(`${process.env.BASE_URL}/trending/movie/week?api_key=${process.env.API_KEY}`).then((response) => response.json());
	}

	@Query(() => MovieDetails)
	async movieDetails(@Arg("id") id: string): Promise<MovieDetails> {
		return await fetch(`${process.env.BASE_URL}/movie/${id}?api_key=${process.env.API_KEY}`).then((response) => response.json());
	}
}
