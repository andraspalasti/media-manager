require("dotenv").config();

import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import { buildSchema } from "type-graphql";
import { MovieResolver } from "./resolvers/movieResolver";
import { ContextType } from "./types";
import { createConnection } from "typeorm";
import { Movie } from "./entities/movie";
import { MovieGenre } from "./entities/movieGenre";
import setup from "./setup";
import { MovieRequestResolver } from "./resolvers/movieRequestResolver";

(async () => {
	const connection = await createConnection({
		name: "media",
		type: "mysql",
		host: "localhost",
		port: 3306,
		username: "root",
		password: "root",
		database: "media",
		synchronize: true,
		logging: true,
		entities: [Movie, MovieGenre],
	});
	if ((await connection.createQueryBuilder().select("genres").from(MovieGenre, "genres").getMany()).length === 0) {
		await setup({ db: connection.createQueryBuilder() });
	}

	const schema = await buildSchema({
		resolvers: [MovieResolver, MovieRequestResolver],
	});

	const server = new ApolloServer({
		schema,
		context: (): ContextType => {
			return { db: connection.createQueryBuilder() };
		},
	});

	const app = express();
	server.applyMiddleware({ app });

	app.listen({ port: 4000 }, () => console.log(`Server ready at http://localhost:4000${server.graphqlPath}`));
})();
