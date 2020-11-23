import { Browser } from "puppeteer";
import { Connection } from "typeorm";

export interface ContextType {
	db: Connection;
	browser: Browser;
}
