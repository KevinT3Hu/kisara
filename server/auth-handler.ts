import { Hono } from "hono";
import { setCookie, getCookie } from "hono/cookie";
import "dotenv/config";

const app = new Hono();

interface Session {
	expiresAt: number;
	token: string;
}

const sessions: Record<string, Session> = {};
const sessionTimeout = 1000 * 60 * 60 * 24 * 7; // 7 days
const sessionCookieName = "session";

app.post("/login", async (c) => {
	const { password } = await c.req.json();
	if (password === process.env.PASSWORD) {
		console.log("Password is correct");
		const token = Math.random().toString(36).substring(2);
		const expiresAt = Date.now() + sessionTimeout;
		sessions[token] = { expiresAt, token };
		setCookie(c, sessionCookieName, token, {
			httpOnly: true,
			maxAge: sessionTimeout / 1000,
			sameSite: "lax",
		});
		return c.json({ status: true });
	}
	return c.json({ status: false }, 401);
});

app.get("/status", async (c) => {
	const token = getCookie(c, sessionCookieName);
	if (!token || !sessions[token]) {
		return c.json({ status: false });
	}
	const session = sessions[token];
	if (session.expiresAt < Date.now()) {
		delete sessions[token];
		setCookie(c, sessionCookieName, "", {
			maxAge: -1,
			httpOnly: true,
			sameSite: "lax",
		});
		return c.json({ status: false });
	}
	return c.json({ status: true });
});

export function isTokenLoggedIn(token: string): boolean {
	if (!token || !sessions[token]) {
		return false;
	}
	const session = sessions[token];
	if (session.expiresAt < Date.now()) {
		delete sessions[token];
		return false;
	}
	return true;
}

export default app;
