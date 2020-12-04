require("dotenv").config();

import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { PubSub } from "graphql-subscriptions";
import { execute, subscribe } from "graphql";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { createServer } from "http";
import express from "express";
import cors from "cors";
import puppeteer from "puppeteer";
import WebTorrent from "webtorrent";
import { createConnection } from "typeorm";
import setup from "./setup";
import { ContextType } from "./types";
import { MovieResolver } from "./resolvers/movieResolver";
import { MovieRequestResolver } from "./resolvers/movieRequestResolver";
import { VideoResolver } from "./resolvers/videoResolver";
import { TorrentResolver } from "./resolvers/torrentResolver";

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
	const client = new WebTorrent();

	await setup({ browser, client });
	const schema = await buildSchema({
		resolvers: [MovieResolver, MovieRequestResolver, VideoResolver, TorrentResolver],
	});
	const apolloServer = new ApolloServer({
		schema,
		context: (): ContextType => {
			return { browser, client };
		},
		subscriptions: { path: "/subscriptions" },
	});
	const app = express();
	const corsOptions = {
		origin: true,
		credentials: true,
	};
	app.use(cors(corsOptions));
	apolloServer.applyMiddleware({ app });

	const pubsub = new PubSub();
	const server = createServer(app);

	server.listen(4000, () => {
		new SubscriptionServer({ execute, subscribe, schema }, { server });
		console.log(`Server ready at http://localhost:4000${apolloServer.graphqlPath}`);
		console.log(`Subscriptions ready at ws://localhost:4000${apolloServer.subscriptionsPath}`);
	});
})();
