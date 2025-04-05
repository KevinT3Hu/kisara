import { redirect } from "vike/abort";
import type { GuardAsync } from "vike/types";

const guard: GuardAsync = async (pageContext): ReturnType<GuardAsync> => {
	const { session } = pageContext;
	if (!session) {
		throw redirect("/login", 302);
	}
};

export { guard };
