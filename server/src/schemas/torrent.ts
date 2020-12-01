import { ObjectType, Field, Int, ID, Float, createUnionType } from "type-graphql";

@ObjectType()
export class Torrent {
	@Field(() => ID)
	title!: string;

	@Field()
	size!: string;

	@Field()
	type!: string;

	@Field()
	downloadLink!: string;

	@Field(() => Int)
	files!: number;

	@Field(() => Int)
	seed!: number;
}

@ObjectType()
export class TorrentProgress {
	@Field(() => ID)
	torrentId!: string;

	@Field(() => Float, { nullable: true })
	progress?: number;

	@Field(() => Float, { nullable: true })
	downloaded?: number;

	@Field(() => Float, { nullable: true })
	downloadSpeed?: number;

	@Field(() => Float, { nullable: true })
	size?: number;

	@Field({ nullable: true })
	timeRemaining?: string;

	@Field({ nullable: true })
	error?: string;
}
