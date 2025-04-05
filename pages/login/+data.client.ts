import { redirect } from "vike/abort";

async function data() {
	const response = await fetch("/_auth/status");
	if (!response.ok) {
		return {};
	}
	const { status } = await response.json();
	if (status !== undefined && status) {
		throw redirect("/", 302);
	}
}

export { data };
