import { Field } from "type-graphql/dist/decorators/Field";
import { ObjectType } from "type-graphql/dist/decorators/ObjectType";
import { ID, Int } from "type-graphql/dist/scalars/aliases";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@ObjectType()
@Entity()
export class Movie {
	@Field((type) => ID)
	@PrimaryGeneratedColumn()
	id!: number;

	@Field()
	@Column({ nullable: true })
	movieId?: string;

	@Field()
	@Column({ unique: true, nullable: true })
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
	@CreateDateColumn()
	addedAt: Date = new Date();

	@Field({ nullable: true })
	@Column({ nullable: true })
	finishedAt?: Date;

	@Field()
	@Column({ default: false })
	completed!: boolean;
}
