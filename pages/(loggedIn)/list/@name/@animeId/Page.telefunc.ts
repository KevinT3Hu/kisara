import { updateEpisodeWatched } from "@/database/animeQueries";
import { getContext } from "telefunc";

export async function onMarkEpisode(episodeId: number, watched: boolean) {
	const { session } = getContext();
	if (!session) {
		throw new Error("Not logged in");
	}
	return updateEpisodeWatched(episodeId, watched);
}
