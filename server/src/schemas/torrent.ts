import { ObjectType, Field, Int, ID } from "type-graphql";

@ObjectType()
export class Torrent {
	@Field(() => ID)
	title!: string;

	@Field()
	size!: string;

	@Field()
	type!: string;

	@Field(() => Int)
	files!: number;

	@Field(() => Int)
	seed!: number;
}
