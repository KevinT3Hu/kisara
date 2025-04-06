import {
	addToListQuery,
	getIsAnimeInList,
	insertEpisodesQuery,
} from "@/database/animeQueries";
import type { Anime } from "./anime";
import { Abort, getContext } from "telefunc";

export async function onAddToList(anime: Anime, list: string) {
	const { session } = getContext();
	if (!session) {
		throw Abort("Not logged in");
	}

	if (await getIsAnimeInList(anime.id)) {
		throw Abort("Already in list");
	}

	await addToListQuery(
		anime.id,
		list,
		anime.name,
		anime.name_cn,
		anime.images.common,
		anime.date ? new Date(anime.date) : null,
	);

	const episodesRet = await fetch(
		`https://api.bgm.tv/v0/episodes?subject_id=${anime.id}&type=0`,
		{
			method: "GET",
		},
	);
	const episodes = await episodesRet.json().catch((e) => {
		console.error(e);
		return {
			ok: false,
			e: e,
		};
	});
	if (episodes.ok === false) {
		return Promise.reject(new Error(episodes.e));
	}
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
	}

	await insertEpisodesQuery(anime.id, data);
}

export async function onGetIsAnimeInList(id: number) {
	const { session } = getContext();
	if (!session) {
		throw Abort("Not logged in");
	}
	return getIsAnimeInList(id);
}
