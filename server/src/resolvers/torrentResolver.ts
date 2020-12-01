import { Page } from "puppeteer";
import { Query, Arg, Resolver, Ctx, Mutation, Field, ArgsType, Args, Subscription, Root, PubSub, PubSubEngine } from "type-graphql";
import { getCookies, updateCookies } from "../cookies";
import { Torrent, TorrentProgress } from "../schemas/torrent";
import { ContextType, Void } from "../types";
import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import { Movie } from "../entities/movie";
import { GraphQLError } from "graphql";

@Resolver(Torrent)
export class TorrentResolver {
	@Subscription(() => TorrentProgress, {
		topics: ({ args }) => args.torrentId,
	})
	torrentProgress(@Root() torrentProgress: TorrentProgress, @Arg("torrentId") torrentId: string) {
		return { ...torrentProgress };
	}

	@Mutation(() => Void)
	async downloadTorrent(
		@Args(() => downloadTorrentArgs) { downloadLink, movieId, title, torrentName }: downloadTorrentArgs,
		@Ctx() { client, db }: ContextType,
		@PubSub() pubSub: PubSubEngine
	) {
		try {
			const movie = await db.getRepository(Movie).findOne({ where: { torrentName } });
			if (movie) return new GraphQLError("You already downloaded this torrent");
			const res = await fetch(downloadLink, {
				headers: {
					cookie: getCookies()
						.map((cookie) => `${cookie.name}=${cookie.value}`)
						.join(";"),
				},
			});
			if (!res.ok) return new GraphQLError("There is no torrent with this download link");
			const destination = path.join(__dirname, "../../torrents", `${torrentName}.torrent`);
			const fileStream = fs.createWriteStream(destination);
			await new Promise((resolve, reject) => {
				res.body.pipe(fileStream);
				res!.body!.on("error", reject);
				fileStream.on("finish", () => {
					resolve();
				});
			});
			const torrent = client.add(destination, { path: process.env.MOVIES_FOLDER });
			torrent.on("ready", async () => {
				await db.getRepository(Movie).insert({ torrentId: torrent.infoHash, size: torrent.length, movieId, title, torrentName });
			});
			torrent.on("done", async () => {
				await db.getRepository(Movie).update({ torrentId: torrent.infoHash }, { completed: true, finishedAt: new Date() });
				torrent.removeAllListeners();
			});
			let percent = 0;
			torrent.on("download", () => {
				if (percent < Math.floor(torrent.progress * 100)) {
					pubSub.publish(torrent.infoHash, {
						torrentId: torrent.infoHash,
						downloadSpeed: torrent.downloadSpeed,
						downloaded: torrent.downloaded,
						progress: torrent.progress,
						size: torrent.length,
						timeRemaining: torrent.timeRemaining.toString(),
					} as TorrentProgress);
					percent++;
				}
			});
			torrent.on("error", async (error) => {
				torrent.removeAllListeners();
				console.error("Error", error);
				await db.getRepository(Movie).delete({ torrentId: torrent.infoHash });
				pubSub.publish(torrent.infoHash, new GraphQLError(error.toString()));
			});
		} catch (error) {
			return new GraphQLError(error);
		}
	}

	@Query(() => [Torrent])
	async getTorrents(@Arg("title") title: string, @Ctx() { browser }: ContextType): Promise<Torrent[]> {
		const escapedTitle = title.match(/[a-zA-Z0-9\s]/gi)?.join("");
		const page = await browser.newPage();
		await page.goto(process.env.TORRENT_SITE!, { waitUntil: "load", timeout: 60000 }).catch((error) => new Error(error));
		updateCookies(await page.cookies());
		// Navigate to downloads page and deal with filters
		await page.$x('//*[@id="menu"]/tbody/tr/td[2]/a').then((el) => el[0].click());
		await page.waitForNavigation({ waitUntil: "domcontentloaded" });
		await clearFilters(page);
		await addFilters(page, "movie");
		// start searching for the given title
		await page.type("input#ls", escapedTitle!);
		await page.$x('//*[@id="bottom"]/tbody/tr/td[2]/table/tbody/tr[1]/td/input[2]').then((el) => el[0].click());
		await page.waitForNavigation({ waitUntil: "domcontentloaded" });
		const torrents = await scrapeTorrents(page);
		await page.close();
		return torrents;
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

const scrapeTorrents = async (page: Page) => {
	var torrents: Torrent[] = [];
	let nextPage = 1;
	while (true) {
		const torrentsOfPage = await page.evaluate(() => {
			const torrents: Torrent[] = [];
			document.querySelectorAll("#torrenttable tr").forEach((el, index) => {
				if (index > 0) {
					const row = Array.from(el.children);
					const torrent: Torrent = { title: "", files: 0, seed: 0, size: "", type: "", downloadLink: "" };
					row.forEach((col, index) => {
						switch (index) {
							case 0:
								torrent.type = col.querySelector("img")?.alt.split("/")[2] || "";
								break;
							case 1:
								torrent.title = col.querySelector("a")?.title || col.querySelector("a")?.innerText || "";
								const el = <HTMLAnchorElement>col.querySelector('a[title = "Letöltés"]');
								torrent.downloadLink = el.href;
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
					torrents.push(torrent);
				}
			});
			return torrents;
		});
		torrents = [...torrentsOfPage, ...torrents];
		try {
			await Promise.all([page.click(`#pagerbottom${nextPage}`), page.waitForNavigation({ waitUntil: "networkidle2" })]);
			nextPage++;
		} catch (e) {
			break;
		}
	}
	return torrents;
};

@ArgsType()
class downloadTorrentArgs {
	@Field()
	movieId!: string;

	@Field()
	downloadLink!: string;

	@Field()
	title!: string;

	@Field()
	torrentName!: string;

	@Field(() => String)
	type!: "movie" | "tvshow";
}
