import esbuild from "esbuild";

async function build() {
	await esbuild.build({
		logLevel: "info",
		entryPoints: ["./hono-entry.node.ts"],
		outdir: "./dist",
		outExtension: { ".js": ".mjs" },
		minify: true,
		bundle: true,
		platform: "node",
		format: "esm",
		banner: {
			js: 'import { createRequire as topLevelCreateRequire } from "module"; import url from "url"; const require = topLevelCreateRequire(import.meta.url); const __filename = url.fileURLToPath(import.meta.url); const __dirname = url.fileURLToPath(new URL(".", import.meta.url));',
		},
	});
}

build().then(() => {
	console.log("Build complete");
});
