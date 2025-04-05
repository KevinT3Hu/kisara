import { getListsQuery } from "@/database/animeQueries";
import type { PageContextServer } from "vike/types";

export type Data = Awaited<ReturnType<typeof data>>;

export { data };

async function data(_: PageContextServer) {
	return getListsQuery();
}
