import { getListsQuery } from "@/database/animeQueries";

export type Data = Awaited<ReturnType<typeof data>>;

export async function data() {
	return await getListsQuery();
}
