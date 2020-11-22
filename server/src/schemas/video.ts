import { Field, ID, Int, ObjectType } from "type-graphql";

@ObjectType()
export class VideoRequest {
	@Field(() => ID)
	id!: number;

	@Field(() => [Video])
	results!: Video[];
}

@ObjectType()
export class Video {
	@Field()
	id!: string;

	@Field()
	iso_639_1!: string;

	@Field()
	iso_3166_1!: string;

	@Field()
	key!: string;

	@Field()
	name!: string;

	@Field()
	site!: string;

	@Field(() => Int)
	size!: string;

	@Field()
	type!: string;
}
