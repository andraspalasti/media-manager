import { Page } from "puppeteer";
import { Query, Arg, Resolver, Ctx } from "type-graphql";
import { Torrent } from "../schemas/torrent";
import { ContextType } from "../types";

const baseUrl = "https://bithumen.be/";
const userName = "nyuszis";
const password = "anita";

@Resolver(Torrent)
export class TorrentResolver {
	@Query(() => String)
	async getMovieTorrents(@Arg("title") title: string, @Ctx() { browser }: ContextType) {
		const page = await browser.newPage();
		try {
			await page.goto(baseUrl, { waitUntil: "load", timeout: 60000 }).catch((error) => new Error(error));
			// Signing in and navigating to downloads page
			// await page.type("input#loginform_username", userName);
			// await page.type("input#loginform_password", password);
			// await page.click("#loginform_submit");
			// await page.waitForSelector("div#logoholderdiv");
			// await page.$x('//*[@id="menu"]/tbody/tr/td[2]/a').then((el) => el[0].click());
			// await page.waitForNavigation({ waitUntil: "domcontentloaded" });

			await clearFilters(page);
			await addFilters(page, "movie");
			// start searching for the given title
			await page.type("input#ls", title);
			await page.$x('//*[@id="bottom"]/tbody/tr/td[2]/table/tbody/tr[1]/td/input[2]').then((el) => el[0].click());
			await page.waitForNavigation({ waitUntil: "domcontentloaded" });

			const results = await page.evaluate(() => {
				const results: Torrent[] = [];
				document.querySelectorAll("#torrenttable tr").forEach((el, index) => {
					if (index > 0) {
						const row = Array.from(el.children);
						const torrent: Torrent = { title: "", files: 0, seed: 0, size: "", type: "" };
						row.forEach((col, index) => {
							switch (index) {
								case 0:
									torrent.type = col.querySelector("img")?.alt.split("/")[2] || "";
									break;
								case 1:
									torrent.title = col.querySelector("a")?.title || col.querySelector("a")?.innerText || "";
									break;
								case 2:
									torrent.files = Number(col.textContent) || 0;
									break;
								case 5:
									torrent.size = col.querySelector("u")?.innerText || "";
									break;
								case 7:
									torrent.seed = Number(col.textContent) || 0;
									break;
								default:
									break;
							}
						});
						results.push(torrent);
					}
				});
				return results;
			});
			console.log(results[0]);

			return JSON.stringify({ result: ["success"], error: "" });
		} catch (error) {
			return JSON.stringify({ result: [], error });
		} finally {
			await page.close();
		}
	}
}

const clearFilters = async (page: Page) => {
	await page.$$eval('input[type="checkbox"]:checked', (elements) => {
		elements.forEach((el) => {
			const element = <HTMLInputElement>el;
			element.click();
		});
	});
};

const addFilters = async (page: Page, type: "movie" | "tvshow") => {
	await page.evaluate(
		({ type }) => {
			let mediaType = new RegExp(type == "movie" ? "film" : "sorozat", "gi");
			document.querySelectorAll('tr input[type="checkbox"]').forEach((el) => {
				if (el.nextElementSibling?.textContent && el.nextElementSibling?.textContent.match(mediaType)) {
					const element = <HTMLInputElement>el;
					element.click();
				}
			});
		},
		{ type }
	);
};
