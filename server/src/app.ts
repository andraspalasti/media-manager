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
import cors from "cors";
import setup from "./setup";
import { MovieDetailsResolver } from "./resolvers/movieDetailsResolver";
import { VideoResolver } from "./resolvers/videoResolver";
import puppeteer from "puppeteer";
import { TorrentResolver } from "./resolvers/torrentResolver";

(async () => {
	const orm = await MikroORM.init(ORMconfig);
	const browser = await puppeteer.launch({ headless: process.env.NODE_ENV === "production" });
	// if ((await orm.em.find(MovieGenre, {})).length === 0) {
	await setup({ db: orm.em.fork(), browser: browser });
	// }

	const schema = await buildSchema({
		resolvers: [MovieResolver, MovieRequestResolver, MovieDetailsResolver, VideoResolver, TorrentResolver],
	});
	const server = new ApolloServer({
		schema,
		context: async (): Promise<ContextType> => {
			return { db: orm.em.fork(), browser: browser };
		},
	});

	const app = express();

	const corsOptions = {
		origin: true,
		credentials: true,
	};

	app.use(cors(corsOptions));

	server.applyMiddleware({ app });

	app.listen({ port: 4000 }, () => console.log(`Server ready at http://localhost:4000${server.graphqlPath}`));
})();
