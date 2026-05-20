import { handle } from "@hono/node-server/vercel";
import { waitUntil } from "@vercel/functions";
import app from "../src/index.js";

// Expose waitUntil so auth.ts backgroundTasks.handler can use it without
// creating a circular import between auth.ts and this entry point.
(globalThis as Record<string, unknown>).__waitUntil = waitUntil;

// pg requires the Node.js runtime — Edge runtime does not support it.
export const runtime = "nodejs";

export default handle(app);
