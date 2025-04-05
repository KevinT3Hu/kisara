import { vikeHandler } from "./server/vike-handler";
import { telefuncHandler } from "./server/telefunc-handler";
import { Hono } from "hono";
import { createHandler } from "@universal-middleware/hono";
import authHandler from "./server/auth-handler";

const app = new Hono();

app.route("/_auth", authHandler);

app.post("/_telefunc", createHandler(telefuncHandler)());

/**
 * Vike route
 *
 * @link {@see https://vike.dev}
 **/
app.all("*", createHandler(vikeHandler)());

export default app;
