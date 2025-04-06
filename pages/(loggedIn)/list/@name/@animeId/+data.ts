import { getAnimeById } from "@/database/animeQueries";
import { redirect } from "vike/abort";
import type { PageContext } from "vike/types";
import { data as outerData } from "../+data";

export type Data = Awaited<ReturnType<typeof data>>;

export async function data(pageContext: PageContext) {
	console.log("list/@name/@animeId/+data.ts");
	const animeId = pageContext.routeParams.animeId;

	const { anime, episodes } = await getAnimeById(Number(animeId)).catch(() => {
		const list = pageContext.routeParams.name;
		throw redirect(`/list/${list}`);
	});

	const outerDataRet = await outerData(pageContext);

	return {
		anime,
		episodes,
		...outerDataRet,
	};
}
