import { SelectQueryBuilder } from "typeorm";

export interface ContextType {
	db: SelectQueryBuilder<any>;
}
