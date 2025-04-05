import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { animeTable, episodeTable } from "./schema";
import { and, eq } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL || "");

export async function getListsQuery() {
	return db
		.selectDistinct({
			list: animeTable.listName,
		})
		.from(animeTable)
		.then((rows) => {
			return rows.map((row) => row.list);
		});
}

export async function addToListQuery(
	animeId: number,
	listName: string,
	name: string,
	nameCN: string,
	image: string,
	airDate: Date | null,
) {
	return db
		.insert(animeTable)
		.values({
			id: animeId,
			listName: listName,
			name: name,
			nameCN: nameCN,
			image: image,
			airDate: airDate,
		})
		.onConflictDoNothing()
		.execute();
}

export async function insertEpisodesQuery(
	animeId: number,
	episodes: {
		id: number;
		name: string;
		name_cn: string;
		airdate: string;
		sort: number;
		ep?: number;
	}[],
) {
	return db
		.insert(episodeTable)
		.values(
			episodes.map((episode) => ({
				id: episode.id,
				animeId: animeId,
				episodeName: episode.name,
				episodeNameCN: episode.name_cn,
				releaseDate: new Date(episode.airdate),
				sort: episode.sort,
				ep: episode.ep || null,
			})),
		)
		.onConflictDoNothing()
		.execute();
}

export async function updateEpisodesQuery(
	animeId: number,
	episodes: {
		id: number;
		name: string;
		name_cn: string;
		airdate: string;
		sort: number;
		ep?: number;
	}[],
) {
	return db.transaction(async (tx) => {
		for (const episode of episodes) {
			await tx
				.update(episodeTable)
				.set({
					episodeName: episode.name,
					episodeNameCN: episode.name_cn,
					releaseDate: new Date(episode.airdate),
					sort: episode.sort,
					ep: episode.ep || null,
				})
				.where(eq(episodeTable.id, episode.id))
				.execute();
		}
	});
}

const animeEpisodeReducer = (
	rows: {
		animes: typeof animeTable.$inferSelect;
		episodes: typeof episodeTable.$inferSelect;
	}[],
) => {
	return rows
		.reduce(
			(acc, row) => {
				const { animes, episodes } = row;
				const anime = acc.find((a) => a.anime.id === animes.id);

				if (anime) {
					anime.episodes.push(episodes);
				} else {
					acc.push({
						anime: animes,
						episodes: [episodes],
					});
				}
				return acc;
			},
			[] as {
				anime: typeof animeTable.$inferSelect;
				episodes: (typeof episodeTable.$inferSelect)[];
			}[],
		)
		.map((row) => {
			const eps = row.episodes.sort((a, b) => {
				return a.sort - b.sort;
			});
			return {
				anime: row.anime,
				episodes: eps,
			};
		});
};

export async function getListAnimes(list: string) {
	return db
		.select()
		.from(animeTable)
		.innerJoin(episodeTable, eq(episodeTable.animeId, animeTable.id))
		.where(eq(animeTable.listName, list))
		.groupBy(animeTable.id, episodeTable.id)
		.execute()
		.then(animeEpisodeReducer);
}

export async function getAnimeById(animeId: number) {
	return db
		.select()
		.from(animeTable)
		.where(eq(animeTable.id, animeId))
		.innerJoin(episodeTable, eq(episodeTable.animeId, animeTable.id))
		.groupBy(animeTable.id, episodeTable.id)
		.execute()
		.then(animeEpisodeReducer)
		.then((rows) => {
			if (rows.length === 0) {
				throw new Error("Anime not found");
			}
			return rows[0];
		});
}

export async function updateEpisodeWatched(
	episodeId: number,
	watched: boolean,
) {
	await db
		.update(episodeTable)
		.set({
			watched: watched,
		})
		.where(eq(episodeTable.id, episodeId))
		.execute();

	const animeId = await db
		.select()
		.from(episodeTable)
		.where(eq(episodeTable.id, episodeId))
		.then((rows) => {
			if (rows.length === 0) {
				throw new Error("Episode not found");
			}
			return rows[0].animeId;
		});
	const watchedAll = await db
		.select()
		.from(episodeTable)
		.where(
			and(eq(episodeTable.animeId, animeId), eq(episodeTable.watched, false)),
		)
		.then((rows) => {
			return rows.length === 0;
		});

	await db
		.update(animeTable)
		.set({
			finished: watchedAll,
		})
		.where(eq(animeTable.id, animeId))
		.execute();
}
