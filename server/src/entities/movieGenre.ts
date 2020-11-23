import { Column, Entity, PrimaryColumn } from "typeorm";
@Entity()
export class MovieGenre {
	@PrimaryColumn()
	id!: number;

	@Column()
	name!: string;
}
