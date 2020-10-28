import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field } from "type-graphql/dist/decorators/Field";
import { ObjectType } from "type-graphql/dist/decorators/ObjectType";
import { ID, Int } from "type-graphql/dist/scalars/aliases";

@ObjectType()
@Entity()
export class Movie {
	@Field((type) => ID)
	@PrimaryKey()
	id!: number;

	@Field()
	@Property({ unique: true })
	torrentId?: string;

	@Field()
	@Property()
	title!: string;

	@Field()
	@Property()
	torrentName?: string;

	@Field((type) => Int)
	@Property()
	size?: number;

	@Field()
	@Property()
	addedAt: Date = new Date();

	@Field({ nullable: true })
	@Property({ nullable: true })
	finishedAt?: Date;

	@Field()
	@Property({ default: false })
	completed!: boolean;
}
