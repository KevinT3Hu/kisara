import {
	getListAnimes,
	getListsQuery,
	updateEpisodesQuery,
} from "@/database/animeQueries";
import { redirect } from "vike/abort";
import type { PageContext } from "vike/types";
import dayjs from "dayjs";

export type Data = Awaited<ReturnType<typeof data>>;

export { data };

async function data(pageContext: PageContext) {
	console.log("list/@name/+data.ts");
	const lists = await getListsQuery();
	const selected = pageContext.routeParams.name;
	if (!lists.includes(selected)) {
		throw redirect("/list", 301);
	}

	const data = await getListAnimes(selected);

	for (const item of data) {
		const anime = item.anime;

		if (!anime.finished) {
			// if info_updated_at is null or info_updated_at is older than 3 days
			const now = new Date();
			const infoUpdatedAt = anime.info_updated_at;
			if (
				!infoUpdatedAt ||
				now.getTime() - infoUpdatedAt.getTime() > 3 * 24 * 60 * 60 * 1000
			) {
				// update anime info
				const episodesRet = await fetch(
					`https://api.bgm.tv/v0/episodes?subject_id=${anime.id}&type=0`,
					{
						method: "GET",
					},
				);
				const episodes = await episodesRet.json();
				const total = episodes.total as number;
				const limit = episodes.limit as number;
				let offset = episodes.offset as number;
				const data = episodes.data as {
					id: number;
					name: string;
					name_cn: string;
					airdate: string;
					sort: number;
					ep?: number;
				}[];

				offset += limit;
				while (offset < total) {
					const episodesRet = await fetch(
						`https://api.bgm.tv/v0/episodes?subject_id=${anime.id}&type=0&offset=${offset}`,
						{
							method: "GET",
						},
					);
					const episodes = await episodesRet.json();
					offset += limit;
					data.push(
						...(episodes.data as {
							id: number;
							name: string;
							name_cn: string;
							airdate: string;
							sort: number;
							ep?: number;
						}[]),
					);

					await updateEpisodesQuery(anime.id, data);
				}
			}
		}
	}

	// query all episodes
	const dataRefetch = await getListAnimes(selected);

	const airToday = dataRefetch.filter((item) => {
		const episodes = item.episodes;
		const todayEpisodes = episodes.filter((episode) => {
			if (!episode.releaseDate) {
				return false;
			}
			const day = dayjs(episode.releaseDate);
			const todayDate = dayjs().startOf("day");
			const todayDateEnd = dayjs().endOf("day");
			return day.isAfter(todayDate) && day.isBefore(todayDateEnd);
		});
		return todayEpisodes.length > 0;
	});

	const unwatched = dataRefetch.filter((item) => {
		const episodes = item.episodes;
		const unwatchedEpisodes = episodes.filter((episode) => {
			if (!episode.releaseDate) {
				return false;
			}
			const day = dayjs(episode.releaseDate);
			const todayDateEnd = dayjs().endOf("day");
			return day.isBefore(todayDateEnd) && !episode.watched;
		});
		return unwatchedEpisodes.length > 0;
	});

	const unfinished = dataRefetch.filter((item) => {
		const anime = item.anime;
		return anime.finished === false;
	});

	return {
		lists,
		selected,
		data: dataRefetch,
		airToday,
		unwatched,
		unfinished,
	};
}
