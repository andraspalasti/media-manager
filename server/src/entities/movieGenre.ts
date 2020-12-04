import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";
@Entity()
export class MovieGenre extends BaseEntity {
	@PrimaryColumn()
	id!: number;

	@Column()
	name!: string;
}
