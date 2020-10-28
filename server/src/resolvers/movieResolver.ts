import { Arg, Ctx, Field, InputType, Int, Mutation, Resolver } from "type-graphql";
import { Query } from "type-graphql/dist/decorators/Query";
import { Movie } from "../entities/movie";
import { ContextType } from "../types";

@Resolver(Movie)
export class MovieResolver {
	@Query(() => [Movie])
	async movies(@Ctx() { db }: ContextType) {
		return await db.find(Movie, {});
	}

	// @Mutation(() => Movie)
	// async addMovie(
	// 	@Arg("data", () => MovieInput) { torrentId, title, torrentName, size }: MovieInput,
	// 	@Ctx() { db }: ContextType
	// ): Promise<Partial<Movie>> {
	// 	const movie = new Movie(torrentId, );
	// 	movie.
	// 	// const { generatedMaps } = await await db.insert().into(Movie).values({ torrentId, title, torrentName, size }).execute();
	// 	// return { ...generatedMaps[0], torrentId, torrentName, size, title };
	// }
}

@InputType({ description: "New movie data" })
class MovieInput implements Partial<Movie> {
	@Field()
	torrentId?: string;

	@Field()
	title!: string;

	@Field()
	torrentName!: string;

	@Field((type) => Int)
	size?: number;
}
