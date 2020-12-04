import { Arg } from "type-graphql";
import { Field } from "type-graphql/dist/decorators/Field";
import { ObjectType } from "type-graphql/dist/decorators/ObjectType";
import { Float, ID, Int } from "type-graphql/dist/scalars/aliases";
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@ObjectType()
@Entity()
export class Movie extends BaseEntity {
	@Field(() => ID)
	@PrimaryGeneratedColumn()
	id!: number;

	@Field()
	@Column({ unique: true, nullable: true })
	torrentId?: string;

	@Field()
	@Column()
	title!: string;

	@Field()
	@Column()
	state!: string;

	@Field()
	@Column()
	torrentName?: string;

	@Field(() => Float)
	@Column({ type: "bigint" })
	size?: number;

	@Field(() => Date)
	@CreateDateColumn()
	addedAt: Date = new Date();

	@Field({ nullable: true })
	@Column({ nullable: true })
	finishedAt?: Date;

	@Field()
	@Column({ default: false })
	completed!: boolean;
}

@ObjectType()
export class Movies {
	@Field(() => [Movie])
	movies!: Movie[];
}
