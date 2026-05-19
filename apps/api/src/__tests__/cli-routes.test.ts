import { vi, describe, it, expect, beforeEach } from "vitest";
import { Hono } from "hono";

const mocks = vi.hoisted(() => ({
  getSession: vi.fn(),
  signInSocial: vi.fn(),
  deviceVerify: vi.fn(),
}));

vi.mock("../auth.js", () => ({
  auth: {
    api: {
      getSession: mocks.getSession,
      signInSocial: mocks.signInSocial,
      deviceVerify: mocks.deviceVerify,
    },
  },
}));

import { cliRoutes } from "../routes/cli.js";

const app = new Hono().route("/", cliRoutes);

beforeEach(() => {
  vi.clearAllMocks();
  process.env.BETTER_AUTH_URL = "http://localhost:3001";
});

describe("GET /device", () => {
  it("returns 400 HTML when user_code is missing", async () => {
    const res = await app.request("/device");
    expect(res.status).toBe(400);
    expect(res.headers.get("content-type")).toContain("text/html");
    expect(await res.text()).toContain("Missing code");
  });

  it("returns 400 HTML when user_code format is invalid", async () => {
    const res = await app.request("/device?user_code=bad!");
    expect(res.status).toBe(400);
    expect(await res.text()).toContain("Invalid code");
  });

  it("redirects through GitHub when there is no session", async () => {
    mocks.getSession.mockResolvedValue(null);
    mocks.signInSocial.mockResolvedValue(
      new Response(null, {
        status: 302,
        headers: { Location: "https://example.test/oauth-start" },
      })
    );

    const code = "ABCDEFGH";
    const res = await app.request(`/device?user_code=${code}`);
    expect(res.status).toBe(302);
    expect(res.headers.get("Location")).toBe("https://example.test/oauth-start");
    expect(mocks.signInSocial).toHaveBeenCalledWith({
      body: {
        provider: "github",
        callbackURL: `http://localhost:3001/device?user_code=${encodeURIComponent(code)}`,
      },
      headers: expect.any(Headers),
      asResponse: true,
    });
  });

  it("returns approval HTML when session exists and code is pending", async () => {
    mocks.getSession.mockResolvedValue({
      session: { token: "sess" },
      user: { id: "u1", name: "Sam", email: "sam@example.com" },
    });
    mocks.deviceVerify.mockResolvedValue({ user_code: "ABCDEFGH", status: "pending" });

    const res = await app.request("/device?user_code=abcdefgh");
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain("Authorize Quiver CLI");
    expect(html).toContain("/auth/device/approve");
    expect(html).toContain("/auth/device/deny");
    expect(mocks.deviceVerify).toHaveBeenCalledWith({
      query: { user_code: "ABCDEFGH" },
      headers: expect.any(Headers),
    });
  });

  it("returns 400 HTML when verification fails", async () => {
    mocks.getSession.mockResolvedValue({
      session: { token: "sess" },
      user: { id: "u1", name: "Sam", email: "sam@example.com" },
    });
    mocks.deviceVerify.mockRejectedValue(new Error("invalid_request"));

    const res = await app.request("/device?user_code=ABCDEFGH");
    expect(res.status).toBe(400);
    expect(await res.text()).toContain("Verification failed");
  });

  it("returns 400 HTML when status is not pending", async () => {
    mocks.getSession.mockResolvedValue({
      session: { token: "sess" },
      user: { id: "u1", name: "Sam", email: "sam@example.com" },
    });
    mocks.deviceVerify.mockResolvedValue({ user_code: "ABCDEFGH", status: "approved" });

    const res = await app.request("/device?user_code=ABCDEFGH");
    expect(res.status).toBe(400);
    expect(await res.text()).toContain("Already processed");
  });
});
