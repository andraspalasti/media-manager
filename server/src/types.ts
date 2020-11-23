import { Browser } from "puppeteer";
import { EntityManager, IDatabaseDriver, Connection } from "@mikro-orm/core";

export interface ContextType {
	db: EntityManager<IDatabaseDriver<Connection>>;
	browser: Browser;
}
