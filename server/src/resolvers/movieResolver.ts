import { Arg, FieldResolver, Int, Resolver } from "type-graphql";
import { Query } from "type-graphql/dist/decorators/Query";
import { Movie, Movies } from "../entities/movie";

@Resolver(Movies)
export class MovieResolver {
	@Query(() => Movies)
	async movies(
		@Arg("completed", () => Boolean, { nullable: true }) completed: boolean | undefined,
		@Arg("offset", () => Int, { nullable: true }) offset: number | undefined,
		@Arg("limit", () => Int, { nullable: true }) limit: number | undefined
	) {
		return {
			movies: await Movie.find({
				where: { ...(completed !== undefined ? { completed: completed } : {}) },
				order: { addedAt: "DESC" },
				skip: offset || 0,
				...(limit ? { take: limit } : {}),
			}),
		};
	}

	@FieldResolver(() => Int, { description: "Number of rows in database" })
	async length(@Arg("completed", () => Boolean, { nullable: true }) completed: boolean | undefined): Promise<number> {
		return await Movie.count({ where: { ...(completed !== undefined ? { completed: completed } : {}) } });
	}
}
