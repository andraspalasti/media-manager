import { Field, Float, ID, Int, ObjectType } from "type-graphql";
import { MovieRequest } from "./movieRequest";

@ObjectType()
export class MovieDetails extends MovieRequest {
	// @Field({ nullable: true })
	// belongs_to_collection!: null | object;

	@Field(() => Int)
	budget!: number;

	@Field(() => String, { nullable: true })
	homepage!: string | null;

	@Field(() => String, { nullable: true })
	imdb_id!: string | null;

	@Field(() => [Production_company])
	production_companies!: Production_company[];

	@Field(() => [Production_country])
	production_countries!: Production_country[];

	@Field(() => Float)
	revenue!: number;

	@Field(() => [Genre])
	genres!: Genre[];

	@Field(() => Int, { nullable: true })
	runtime!: number | null;

	@Field(() => [Spoken_language])
	spoken_languages!: Spoken_language[];

	@Field()
	status!: string;

	@Field(() => String, { nullable: true })
	tagline!: string | null;
}

@ObjectType()
class Genre {
	@Field(() => ID)
	id!: number;

	@Field()
	name!: string;
}

@ObjectType()
class Production_country {
	@Field()
	iso_3166_1!: string;

	@Field()
	name!: string;
}

@ObjectType()
class Spoken_language {
	@Field()
	iso_639_1!: string;

	@Field()
	name!: string;
}

@ObjectType()
class Production_company {
	@Field(() => ID)
	id!: number;

	@Field()
	name!: string;

	@Field(() => String, { nullable: true })
	logo_path!: string | null;

	@Field()
	origin_country!: string;
}
