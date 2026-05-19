import { Hono } from "hono";
import { auth } from "../auth.js";
import {
  createCliSession,
  completeCliSession,
  getCliSession,
  deleteCliSession,
} from "../lib/cli-sessions.js";

export const cliRoutes = new Hono();

/**
 * GET /auth/login?state=<state>
 *
 * Step 1 of CLI OAuth flow. Creates a pending cli_session keyed by the
 * state value, then redirects to better-auth's GitHub sign-in with a
 * callbackURL that returns control to /auth/complete after OAuth finishes.
 */
cliRoutes.get("/auth/login", async (c) => {
  const state = c.req.query("state");

  if (!state || !/^[a-zA-Z0-9_-]{16,128}$/.test(state)) {
    return c.json({ error: "Missing or invalid state parameter" }, 400);
  }

  await createCliSession(state);

  const callbackURL = `/auth/complete?cli_state=${encodeURIComponent(state)}`;
  const signInURL = new URL(`${process.env.BETTER_AUTH_URL}/auth/sign-in/social`);
  signInURL.searchParams.set("provider", "github");
  signInURL.searchParams.set("callbackURL", callbackURL);

  return c.redirect(signInURL.toString(), 302);
});

/**
 * GET /auth/complete?cli_state=<state>
 *
 * Step 5 of CLI OAuth flow. better-auth redirects here after GitHub OAuth
 * completes and has already set the session cookie. Read the session, store
 * the token keyed by state, and show a success page so the user can close
 * the browser tab.
 */
cliRoutes.get("/auth/complete", async (c) => {
  const cliState = c.req.query("cli_state");

  if (!cliState) {
    return c.html("<h1>Error</h1><p>Missing cli_state parameter.</p>", 400);
  }

  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session?.session || !session?.user) {
    return c.html(
      "<h1>Authentication failed</h1><p>Please run <code>quiver login</code> again.</p>",
      401
    );
  }

  // user.name is the GitHub display name; the CLI will use it as the display username.
  // The exact GitHub login handle (@username) lives in the account table — can be
  // fetched and stored here in a future iteration if the handle matters.
  await completeCliSession(
    cliState,
    session.session.token,
    session.user.id,
    session.user.name
  );

  return c.html(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Quiver — Authenticated</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 480px; margin: 80px auto; padding: 0 24px; text-align: center; }
    h1 { font-size: 1.5rem; margin-bottom: 8px; }
    p { color: #666; }
  </style>
</head>
<body>
  <h1>You're logged in!</h1>
  <p>Return to your terminal. You can close this tab.</p>
</body>
</html>`);
});

/**
 * GET /auth/cli-token?state=<state>
 *
 * Step 6: CLI polls this endpoint until the token is ready.
 * 202 = OAuth still pending
 * 200 = complete, returns { token, username, userId }
 * 404 = state expired or unknown
 */
cliRoutes.get("/auth/cli-token", async (c) => {
  const state = c.req.query("state");

  if (!state) return c.json({ error: "Missing state parameter" }, 400);

  const cliSession = await getCliSession(state);

  if (!cliSession) return c.json({ error: "Session not found or expired" }, 404);
  if (!cliSession.token) return c.json({ status: "pending" }, 202);

  // Fire-and-forget cleanup — don't block the response
  void deleteCliSession(state).catch((err: unknown) =>
    console.error("[cli-sessions] cleanup failed:", err)
  );

  return c.json({
    token: cliSession.token,
    username: cliSession.username,
    userId: cliSession.userId,
  });
});
