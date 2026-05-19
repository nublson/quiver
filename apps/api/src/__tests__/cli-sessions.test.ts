import { vi, describe, it, expect, beforeEach } from "vitest";

const { cliSession } = vi.hoisted(() => ({
  cliSession: {
    upsert: vi.fn(),
    updateMany: vi.fn(),
    findFirst: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("../db.js", () => ({ prisma: { cliSession } }));

import {
  createCliSession,
  completeCliSession,
  getCliSession,
  deleteCliSession,
} from "../lib/cli-sessions.js";

beforeEach(() => vi.clearAllMocks());

describe("createCliSession", () => {
  it("upserts with the given state and a ~10-minute expiry", async () => {
    cliSession.upsert.mockResolvedValue(undefined);
    const before = Date.now();
    await createCliSession("abc123");
    const call = cliSession.upsert.mock.calls[0][0];
    expect(call.where).toEqual({ state: "abc123" });
    expect(call.create.state).toBe("abc123");
    const expiry: number = call.create.expiresAt.getTime();
    expect(expiry).toBeGreaterThan(before + 9 * 60 * 1000);
    expect(expiry).toBeLessThan(Date.now() + 11 * 60 * 1000);
    expect(call.update).toEqual({});
  });
});

describe("completeCliSession", () => {
  it("updates only non-expired sessions with token, userId, and username", async () => {
    cliSession.updateMany.mockResolvedValue({ count: 1 });
    await completeCliSession("abc123", "tok", "uid-1", "johndoe");
    const call = cliSession.updateMany.mock.calls[0][0];
    expect(call.where.state).toBe("abc123");
    expect(call.where.expiresAt.gt).toBeInstanceOf(Date);
    expect(call.data).toEqual({ token: "tok", userId: "uid-1", username: "johndoe" });
  });
});

describe("getCliSession", () => {
  it("returns the session when found", async () => {
    const mockSession = {
      state: "abc123",
      token: null,
      userId: null,
      username: null,
      createdAt: new Date(),
      expiresAt: new Date(),
    };
    cliSession.findFirst.mockResolvedValue(mockSession);
    const result = await getCliSession("abc123");
    expect(result).toBe(mockSession);
    const call = cliSession.findFirst.mock.calls[0][0];
    expect(call.where.state).toBe("abc123");
    expect(call.where.expiresAt.gt).toBeInstanceOf(Date);
  });

  it("returns null when session is not found or expired", async () => {
    cliSession.findFirst.mockResolvedValue(null);
    expect(await getCliSession("unknown")).toBeNull();
  });
});

describe("deleteCliSession", () => {
  it("deletes the session by state", async () => {
    cliSession.delete.mockResolvedValue({});
    await deleteCliSession("abc123");
    expect(cliSession.delete).toHaveBeenCalledWith({ where: { state: "abc123" } });
  });

  it("swallows errors silently to guard against double-delete races", async () => {
    cliSession.delete.mockRejectedValue(new Error("Record not found"));
    await expect(deleteCliSession("abc123")).resolves.toBeUndefined();
  });
});
