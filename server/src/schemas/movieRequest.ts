import { Field, Float, ID, Int, ObjectType } from "type-graphql";

@ObjectType()
export class MovieResponse {
	@Field(() => Int)
	page!: number;

	@Field(() => Int)
	total_results!: number;

	@Field(() => Int)
	total_pages!: number;

	@Field(() => [MovieRequest])
	results!: MovieRequest[];
}

@ObjectType()
export class MovieRequest {
	@Field({ nullable: true })
	poster_path!: string;

	@Field()
	adult!: boolean;

	@Field()
	overview!: string;

	@Field({ nullable: true })
	release_date!: string;

	genre_ids!: number[];

	@Field(() => ID)
	id!: number;

	@Field()
	original_title!: string;

	@Field()
	original_language!: string;

	@Field()
	title!: string;

	@Field({ nullable: true })
	backdrop_path!: string;

	@Field(() => Float)
	popularity!: number;

	@Field(() => Int)
	vote_count!: number;

	@Field()
	video!: boolean;

	@Field(() => Float)
	vote_average!: number;
}
