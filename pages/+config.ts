import LayoutDefault from "@/layouts/LayoutDefault";
import vikeReact from "vike-react/config";
import type { Config } from "vike/types";

export { config };

const config = {
	Layout: LayoutDefault,
	title: "Kisara",
	extends: [vikeReact],
} satisfies Config;
