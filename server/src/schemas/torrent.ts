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

	@Field(() => Float)
	progress!: number;

	@Field(() => Float)
	downloaded!: number;

	@Field(() => Float)
	downloadSpeed!: number;

	@Field(() => Float)
	size!: number;

	@Field()
	timeRemaining!: string;
}
