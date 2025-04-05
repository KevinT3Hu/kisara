import { telefunc } from "telefunc";
// TODO: stop using universal-middleware and directly integrate server middlewares instead and/or use vike-server https://vike.dev/server. (Bati generates boilerplates that use universal-middleware https://github.com/magne4000/universal-middleware to make Bati's internal logic easier. This is temporary and will be removed soon.)
import type { Get, UniversalHandler } from "@universal-middleware/core";
import { isTokenLoggedIn } from "./auth-handler";

export const telefuncHandler: Get<[], UniversalHandler> =
	() => async (request, context, runtime) => {
		const session = request.headers
			.get("cookie")
			?.split("; ")
			.find((cookie) => cookie.startsWith("session="));
		console.log("cookies", request.headers.get("cookie"));
		if (session) {
			const sessionValue = session.split("=")[1].split(";")[0];
			if (isTokenLoggedIn(sessionValue)) {
				context.session = sessionValue;
			}
		}

		const httpResponse = await telefunc({
			url: request.url.toString(),
			method: request.method,
			body: await request.text(),
			context: {
				...context,
				...runtime,
			},
		});
		const { body, statusCode, contentType } = httpResponse;
		return new Response(body, {
			status: statusCode,
			headers: {
				"content-type": contentType,
			},
		});
	};
