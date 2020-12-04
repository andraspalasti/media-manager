import { GraphQLScalarType } from "graphql";
import { Browser } from "puppeteer";
import { Connection } from "typeorm";
import WebTorrent from "webtorrent";

export interface ContextType {
	browser: Browser;
	client: WebTorrent.Instance;
}

export const Void = new GraphQLScalarType({
	name: "Void",
	description: "Represents NULL values",
	serialize() {
		return null;
	},
	parseValue(value: unknown) {
		return null;
	},
	parseLiteral(ast) {
		return null;
	},
});
