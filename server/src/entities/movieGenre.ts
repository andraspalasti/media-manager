import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class MovieGenre {
	@PrimaryKey()
	id!: number;

	@Property()
	name!: string;
}
