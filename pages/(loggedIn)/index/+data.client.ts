import { redirect } from "vike/abort";

export { data };

async function data() {
	const lastList = localStorage.getItem("lastList") || "";
	throw redirect(`/list/${lastList}`);
}
