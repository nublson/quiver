import { getRequestListener } from "@hono/node-server";
import { waitUntil } from "@vercel/functions";
import type { IncomingMessage, ServerResponse } from "node:http";
import app from "../src/index.js";

// Expose waitUntil so auth.ts backgroundTasks.handler can use it without
// creating a circular import between auth.ts and this entry point.
(globalThis as Record<string, unknown>).__waitUntil = waitUntil;

// pg requires the Node.js runtime — Edge runtime does not support it.
export const runtime = "nodejs";

// hono/vercel passes the raw IncomingMessage to app.fetch, so headers are a
// plain object without .get() — CORS middleware crashes. getRequestListener
// from @hono/node-server correctly converts IncomingMessage → web Request
// before Hono sees it.
const requestListener = getRequestListener(app.fetch);

export default function handler(req: IncomingMessage, res: ServerResponse): void {
  requestListener(req, res);
}
