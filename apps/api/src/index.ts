import { Hono } from "hono";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";
import { auth } from "./auth.js";
import { cliRoutes } from "./routes/cli.js";

const app = new Hono();

app.use(logger());
app.use(secureHeaders());
app.use(
  cors({
    origin: [process.env.BASE_URL!, "http://localhost:3000"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.get("/health", (c) =>
  c.json({ status: "ok", ts: new Date().toISOString() })
);

// Device verification page (`GET /device`) must be registered BEFORE the better-auth catch-all.
// Hono resolves routes in registration order — the wildcard /auth/** would consume plugin routes otherwise.
app.route("/", cliRoutes);

// better-auth handles all remaining /auth/* paths:
// sign-in, callback/github, session, sign-out, etc.
app.on(["GET", "POST"], "/auth/**", (c) => auth.handler(c.req.raw));

app.notFound((c) => c.json({ error: "Not found" }, 404));

app.onError((err, c) => {
  console.error("[error]", err);
  return c.json({ error: "Internal server error" }, 500);
});

// Local development server — not invoked by Vercel (which uses api/index.ts)
if (process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "test") {
  const port = Number(process.env.PORT ?? 3001);
  serve({ fetch: app.fetch, port }, () => {
    console.log(`API running at http://localhost:${port}`);
  });
}

export default app;
