import { vi, describe, it, expect } from "vitest";

vi.mock("../db.js", () => ({ prisma: {} }));
vi.mock("../auth.js", () => ({
  auth: { handler: vi.fn(), api: { getSession: vi.fn() } },
}));

import app from "../index.js";

describe("GET /health", () => {
  it("returns 200 with status ok and a timestamp", async () => {
    const res = await app.request("/health");
    expect(res.status).toBe(200);
    const body = (await res.json()) as { status: string; ts: string };
    expect(body.status).toBe("ok");
    expect(new Date(body.ts).getTime()).toBeGreaterThan(0);
  });
});

describe("unmatched routes", () => {
  it("returns 404 with error not found", async () => {
    const res = await app.request("/does-not-exist");
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: "Not found" });
  });
});
