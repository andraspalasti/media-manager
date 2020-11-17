import { Resolver, Query, Arg } from "type-graphql";
// import { MovieRequest, MovieResponse } from "../schemas/movieRequest";
import fetch from "node-fetch";
import { MovieDetails } from "../schemas/movieDetails";

@Resolver(MovieDetails)
export class MovieDetailsResolver {
	@Query(() => MovieDetails)
	async getMovieDetails(@Arg("id") id: number): Promise<MovieDetails> {
		return await fetch(`${process.env.BASE_URL}/movie/${id}?api_key=${process.env.API_KEY}`).then((response) => response.json());
	}
}
