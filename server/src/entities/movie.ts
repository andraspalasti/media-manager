import { Field } from "type-graphql/dist/decorators/Field";
import { ObjectType } from "type-graphql/dist/decorators/ObjectType";
import { ID, Int } from "type-graphql/dist/scalars/aliases";
import { Column, Entity, PrimaryColumn } from "typeorm";

@ObjectType()
@Entity()
export class Movie {
	@Field((type) => ID)
	@PrimaryColumn()
	id!: number;

	@Field()
	@Column({ unique: true })
	torrentId?: string;

	@Field()
	@Column()
	title!: string;

	@Field()
	@Column()
	torrentName?: string;

	@Field((type) => Int)
	@Column()
	size?: number;

	@Field()
	@Column()
	addedAt: Date = new Date();

	@Field({ nullable: true })
	@Column({ nullable: true })
	finishedAt?: Date;

	@Field()
	@Column({ default: false })
	completed!: boolean;
}
