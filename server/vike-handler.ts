/// <reference lib="webworker" />
import { renderPage } from "vike/server";
// TODO: stop using universal-middleware and directly integrate server middlewares instead and/or use vike-server https://vike.dev/server. (Bati generates boilerplates that use universal-middleware https://github.com/magne4000/universal-middleware to make Bati's internal logic easier. This is temporary and will be removed soon.)
import type { Get, UniversalHandler } from "@universal-middleware/core";
import { isTokenLoggedIn } from "./auth-handler";

export const vikeHandler: Get<[], UniversalHandler> =
	() => async (request, context, runtime) => {
		const session = request.headers
			.get("cookie")
			?.split("; ")
			.find((cookie) => cookie.startsWith("session="));
		if (session) {
			const sessionValue = session.split("=")[1].split(";")[0];
			if (isTokenLoggedIn(sessionValue)) {
				context.session = sessionValue;
			}
		}
		const pageContextInit = {
			...context,
			...runtime,
			urlOriginal: request.url,
			headersOriginal: request.headers,
		};
		const pageContext = await renderPage(pageContextInit);
		const response = pageContext.httpResponse;

		const { readable, writable } = new TransformStream();
		response.pipe(writable);

		return new Response(readable, {
			status: response.statusCode,
			headers: response.headers,
		});
	};
