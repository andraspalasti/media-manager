require("dotenv").config();

import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import { buildSchema } from "type-graphql";
import { MovieResolver } from "./resolvers/movieResolver";
import { ContextType } from "./types";
import { MovieRequestResolver } from "./resolvers/movieRequestResolver";
import cors from "cors";
import setup from "./setup";
import { MovieDetailsResolver } from "./resolvers/movieDetailsResolver";
import { VideoResolver } from "./resolvers/videoResolver";
import puppeteer from "puppeteer";
import { TorrentResolver } from "./resolvers/torrentResolver";
import { createConnection } from "typeorm";

(async () => {
	const db = await createConnection({
		type: "mysql",
		host: "localhost",
		port: 3306,
		username: "root",
		password: "root",
		database: "media",
		entities: [__dirname + "/entities/*{.js,.ts}"],
		synchronize: true,
		logging: process.env.NODE_ENV !== "production",
	});
	const browser = await puppeteer.launch({ headless: process.env.NODE_ENV === "production" });
	await setup({ db: db, browser: browser });

	const schema = await buildSchema({
		resolvers: [MovieResolver, MovieRequestResolver, MovieDetailsResolver, VideoResolver, TorrentResolver],
	});
	const server = new ApolloServer({
		schema,
		context: (): ContextType => {
			return { db: db, browser: browser };
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
