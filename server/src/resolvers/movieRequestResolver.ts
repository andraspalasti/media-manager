import { Resolver, FieldResolver, Ctx, Root, Query, Arg } from "type-graphql";
import { MovieGenre } from "../entities/movieGenre";
import { MovieRequest, MovieResponse } from "../schemas/movieRequest";
import { ContextType } from "../types";
import fetch from "node-fetch";

@Resolver(MovieRequest)
export class MovieRequestResolver {
	@Query(() => MovieResponse)
	async searchMovie(@Arg("title") title: string): Promise<MovieResponse> {
		const movieResponse = await fetch(
			`${process.env.BASE_URL}/search/movie?api_key=${process.env.API_KEY}&query=${title}&include_adult=false`
		).then((response) => response.json());
		return movieResponse;
	}

	@FieldResolver(() => [String])
	async genres(@Root() { genre_ids }: MovieRequest, @Ctx() { db }: ContextType) {
		const result = await db.select(["genres.name"]).from(MovieGenre, "genres").where("genres.id IN (:...genre_ids)", { genre_ids }).getMany();
		console.log(result);
		return result;
	}
}
