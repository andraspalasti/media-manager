import { Configuration, Connection, IDatabaseDriver, MikroORM, Options } from "@mikro-orm/core";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";
import path from "path";

export const ORMconfig = {
	entities: ["./dist/entities/**/*.js"],
	entitiesTs: ["./src/entities/**/*.ts"],
	dbName: "media",
	type: "mysql",
	host: "localhost",
	port: 3306,
	user: "root",
	password: "root",
	debug: true,
	metadataProvider: TsMorphMetadataProvider,
	migrations: {
		path: path.join(__dirname, "./migrations"),
	},
} as Configuration<IDatabaseDriver<Connection>> | Options<IDatabaseDriver<Connection>> | undefined;
