import { updateEpisodeWatched } from "@/database/animeQueries";

export async function onMarkEpisode(episodeId: number, watched: boolean) {
	return updateEpisodeWatched(episodeId, watched);
}
