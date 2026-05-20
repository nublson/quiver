import { symmetricDecrypt } from "better-auth/crypto";
import { Hono } from "hono";
import { auth } from "../auth.js";
import { isAPIError } from "better-auth/api";
import { pool } from "../db.js";

export const cliRoutes = new Hono();

/**
 * GET /cli/github-token
 *
 * Protected by the better-auth Bearer session token. Decrypts the stored GitHub
 * OAuth access token, fetches the GitHub login via the GitHub API, and returns
 * both to the CLI so it can persist credentials locally.
 */
cliRoutes.get("/cli/github-token", async (c) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session?.user) return c.json({ error: "Unauthorized" }, 401);

  const result = await pool.query<{ access_token: string }>(
    `SELECT access_token FROM "account" WHERE user_id = $1 AND provider_id = 'github' LIMIT 1`,
    [session.user.id],
  );
  const encryptedToken = result.rows[0]?.access_token;
  if (!encryptedToken) return c.json({ error: "GitHub account not found" }, 404);

  const githubToken = await symmetricDecrypt({
    data: encryptedToken,
    key: process.env.BETTER_AUTH_SECRET!,
  });

  // user.name is the display name — the login (e.g. "nublson") requires the GitHub API
  const ghRes = await fetch("https://api.github.com/user", {
    headers: { Authorization: `Bearer ${githubToken}`, "User-Agent": "quiver-cli" },
  });
  if (!ghRes.ok) return c.json({ error: "Failed to fetch GitHub user" }, 502);
  const { login } = (await ghRes.json()) as { login: string };

  return c.json({ githubToken, username: login });
});

/** Default device plugin user codes are 8 chars from charset excluding 0,O,1,I. */
const USER_CODE_PATTERN = /^[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{8}$/;

function htmlShell(title: string, inner: string): string {
  const safeTitle = escapeHtml(title);
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${safeTitle}</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 520px; margin: 48px auto; padding: 0 24px; }
    h1 { font-size: 1.35rem; margin-bottom: 12px; }
    p { color: #444; line-height: 1.5; }
    code { font-size: 0.95em; }
    .actions { display: flex; gap: 12px; margin-top: 20px; flex-wrap: wrap; }
    button { padding: 10px 18px; font-size: 1rem; cursor: pointer; border-radius: 8px; border: none; }
    .approve { background: #238636; color: #fff; }
    .deny { background: #f0f0f0; color: #222; }
    #msg { margin-top: 16px; font-weight: 500; }
    .error { color: #b42318; }
    .ok { color: #146234; }
  </style>
</head>
<body>
${inner}
</body>
</html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * GET /device?user_code=<code>
 *
 * Browser verification URI for RFC 8628 device authorization (better-auth plugin).
 * Unauthenticated users are redirected through GitHub OAuth, then return here to claim and approve.
 */
cliRoutes.get("/device", async (c) => {
  const raw = c.req.query("user_code");
  if (!raw?.trim()) {
    return c.html(
      htmlShell(
        "Quiver — Device code",
        `<h1>Missing code</h1><p>Open the link from your terminal or include <code>?user_code=</code>.</p>`
      ),
      400
    );
  }

  const formatted = raw.trim().replace(/-/g, "").toUpperCase();
  if (!USER_CODE_PATTERN.test(formatted)) {
    return c.html(
      htmlShell(
        "Quiver — Invalid code",
        `<h1>Invalid code</h1><p>The device code format is not valid.</p>`
      ),
      400
    );
  }

  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session?.user) {
    const base = process.env.BETTER_AUTH_URL;
    const callbackURL = `${base}/device?user_code=${encodeURIComponent(formatted)}`;

    try {
      return await auth.api.signInSocial({
        body: { provider: "github", callbackURL },
        headers: c.req.raw.headers,
        asResponse: true,
      });
    } catch (err) {
      console.error("[device] signInSocial failed:", err);
      return c.html(
        htmlShell(
          "Quiver — Sign-in error",
          `<h1>Could not start sign-in</h1><p>Please try again from your terminal.</p>`
        ),
        502
      );
    }
  }

  try {
    const verify = await auth.api.deviceVerify({
      query: { user_code: formatted },
      headers: c.req.raw.headers,
    });

    if (verify.status !== "pending") {
      return c.html(
        htmlShell(
          "Quiver — Device authorization",
          `<h1>Already processed</h1><p>This code is no longer pending (status: <code>${escapeHtml(verify.status)}</code>).</p>`
        ),
        400
      );
    }

    const displayName = escapeHtml(session.user.name || session.user.email);
    const userCodeJson = JSON.stringify(formatted);

    return c.html(
      htmlShell(
        "Quiver — Authorize device",
        `<h1>Authorize Quiver CLI</h1>
<p>Signed in as <strong>${displayName}</strong>.</p>
<p>Approve this device to finish CLI login.</p>
<div class="actions">
  <button type="button" class="approve" id="btn-approve">Approve</button>
  <button type="button" class="deny" id="btn-deny">Deny</button>
</div>
<p id="msg"></p>
<script>
  const userCode = ${userCodeJson};
  const msg = document.getElementById('msg');
  function show(text, cls) {
    msg.textContent = text;
    msg.className = cls || '';
  }
  async function postJson(url) {
    const r = await fetch(url, {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userCode }),
    });
    let data = {};
    try { data = await r.json(); } catch (_) {}
    if (!r.ok) {
      const errText = data.error_description || data.message || ('HTTP ' + r.status);
      throw new Error(errText);
    }
    return data;
  }
  document.getElementById('btn-approve').onclick = async () => {
    try {
      await postJson('/auth/device/approve');
      show('Approved. You can close this tab and return to the terminal.', 'ok');
    } catch (e) {
      show(e.message || String(e), 'error');
    }
  };
  document.getElementById('btn-deny').onclick = async () => {
    try {
      await postJson('/auth/device/deny');
      show('Denied. Close this tab.', 'error');
    } catch (e) {
      show(e.message || String(e), 'error');
    }
  };
</script>`
      )
    );
  } catch (err: unknown) {
    const description = isAPIError(err)
      ? err.message
      : err instanceof Error
        ? err.message
        : "Verification failed";
    return c.html(
      htmlShell(
        "Quiver — Verification failed",
        `<h1>Verification failed</h1><p>${escapeHtml(description)}</p>`
      ),
      400
    );
  }
});
