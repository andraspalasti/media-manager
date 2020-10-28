require("dotenv").config();

import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import { buildSchema } from "type-graphql";
import { MovieResolver } from "./resolvers/movieResolver";
import { ContextType } from "./types";
import { MovieRequestResolver } from "./resolvers/movieRequestResolver";
import { MikroORM } from "@mikro-orm/core/MikroORM";
import { ORMconfig } from "./mikro-orm.config";
import { MovieGenre } from "./entities/movieGenre";
import setup from "./setup";

(async () => {
	const orm = await MikroORM.init(ORMconfig);

	if ((await orm.em.find(MovieGenre, {})).length === 0) {
		await setup({ db: orm.em.fork() });
	}

	const schema = await buildSchema({
		resolvers: [MovieResolver, MovieRequestResolver],
	});

	const server = new ApolloServer({
		schema,
		context: (): ContextType => {
			return { db: orm.em.fork() };
		},
	});

	const app = express();
	server.applyMiddleware({ app });

	app.listen({ port: 4000 }, () => console.log(`Server ready at http://localhost:4000${server.graphqlPath}`));
})();
