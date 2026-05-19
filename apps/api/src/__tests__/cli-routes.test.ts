import { vi, describe, it, expect, beforeEach } from "vitest";
import { Hono } from "hono";

const mocks = vi.hoisted(() => ({
  createCliSession: vi.fn(),
  completeCliSession: vi.fn(),
  getCliSession: vi.fn(),
  deleteCliSession: vi.fn(),
  getSession: vi.fn(),
}));

vi.mock("../db.js", () => ({ prisma: {} }));
vi.mock("../auth.js", () => ({
  auth: { handler: vi.fn(), api: { getSession: mocks.getSession } },
}));
vi.mock("../lib/cli-sessions.js", () => ({
  createCliSession: mocks.createCliSession,
  completeCliSession: mocks.completeCliSession,
  getCliSession: mocks.getCliSession,
  deleteCliSession: mocks.deleteCliSession,
}));

import { cliRoutes } from "../routes/cli.js";

const app = new Hono().route("/", cliRoutes);

beforeEach(() => vi.clearAllMocks());

// ─── GET /auth/login ──────────────────────────────────────────────────────────

describe("GET /auth/login", () => {
  it("returns 400 when state is missing", async () => {
    const res = await app.request("/auth/login");
    expect(res.status).toBe(400);
    const body = (await res.json()) as { error: string };
    expect(body.error).toMatch(/state/i);
  });

  it("returns 400 when state is too short (< 16 chars)", async () => {
    const res = await app.request("/auth/login?state=tooshort");
    expect(res.status).toBe(400);
  });

  it("returns 400 when state contains invalid characters", async () => {
    const res = await app.request("/auth/login?state=invalid%20state%20padded%20ok");
    expect(res.status).toBe(400);
  });

  it("creates a cli session and redirects to GitHub sign-in for a valid state", async () => {
    mocks.createCliSession.mockResolvedValue(undefined);
    const state = "a".repeat(32);
    const res = await app.request(`/auth/login?state=${state}`);
    expect(mocks.createCliSession).toHaveBeenCalledWith(state);
    expect(res.status).toBe(302);
    const location = res.headers.get("Location") ?? "";
    expect(location).toContain("/auth/sign-in/social");
    expect(location).toContain("provider=github");
    expect(location).toContain(encodeURIComponent(state));
  });
});

// ─── GET /auth/complete ───────────────────────────────────────────────────────

describe("GET /auth/complete", () => {
  it("returns 400 HTML when cli_state is missing", async () => {
    const res = await app.request("/auth/complete");
    expect(res.status).toBe(400);
    expect(res.headers.get("content-type")).toContain("text/html");
  });

  it("returns 401 HTML when no active session exists", async () => {
    mocks.getSession.mockResolvedValue(null);
    const res = await app.request("/auth/complete?cli_state=valid-state-here-1234");
    expect(res.status).toBe(401);
    expect(res.headers.get("content-type")).toContain("text/html");
  });

  it("completes the cli session and returns success HTML when session exists", async () => {
    mocks.getSession.mockResolvedValue({
      session: { token: "sess-tok" },
      user: { id: "uid-1", name: "Test User" },
    });
    mocks.completeCliSession.mockResolvedValue(undefined);
    const res = await app.request("/auth/complete?cli_state=valid-state-here-1234");
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("text/html");
    expect(await res.text()).toContain("logged in");
    expect(mocks.completeCliSession).toHaveBeenCalledWith(
      "valid-state-here-1234",
      "sess-tok",
      "uid-1",
      "Test User"
    );
  });
});

// ─── GET /auth/cli-token ──────────────────────────────────────────────────────

describe("GET /auth/cli-token", () => {
  it("returns 400 when state is missing", async () => {
    const res = await app.request("/auth/cli-token");
    expect(res.status).toBe(400);
  });

  it("returns 404 when session is not found or expired", async () => {
    mocks.getCliSession.mockResolvedValue(null);
    const res = await app.request("/auth/cli-token?state=somestate");
    expect(res.status).toBe(404);
  });

  it("returns 202 pending while OAuth is in progress", async () => {
    mocks.getCliSession.mockResolvedValue({ token: null, username: null, userId: null });
    const res = await app.request("/auth/cli-token?state=somestate");
    expect(res.status).toBe(202);
    expect(await res.json()).toEqual({ status: "pending" });
  });

  it("returns 200 with credentials and fires session cleanup on completion", async () => {
    mocks.getCliSession.mockResolvedValue({
      token: "bearer-tok",
      username: "johndoe",
      userId: "uid-1",
    });
    mocks.deleteCliSession.mockResolvedValue(undefined);
    const res = await app.request("/auth/cli-token?state=somestate");
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      token: "bearer-tok",
      username: "johndoe",
      userId: "uid-1",
    });
    // deleteCliSession is fire-and-forget; flush the microtask queue before asserting
    await new Promise((r) => setTimeout(r, 10));
    expect(mocks.deleteCliSession).toHaveBeenCalledWith("somestate");
  });
});
