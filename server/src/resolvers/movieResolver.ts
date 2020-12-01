import { Arg, Ctx, Resolver } from "type-graphql";
import { Query } from "type-graphql/dist/decorators/Query";
import { Movie } from "../entities/movie";
import { ContextType } from "../types";

@Resolver(Movie)
export class MovieResolver {
	@Query(() => [Movie])
	async movies(@Arg("completed", () => Boolean, { nullable: true }) completed: Boolean | null, @Ctx() { db }: ContextType) {
		if (completed) {
			return await db.getRepository(Movie).find({ where: { completed } });
		}
		return await db.getRepository(Movie).find();
	}
}
