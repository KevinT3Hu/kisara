import { removeAnime } from "@/database/animeQueries";
import { getContext } from "telefunc";

export async function onRemoveAnime(id: number) {
	const { session } = getContext();
	if (!session) {
		throw new Error("Not logged in");
	}
	return removeAnime(id);
}
