import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const TOKEN = "ghp_testtoken";
const GIST_ID = "gist123";

function mockFetch(status: number, body: unknown) {
  return vi.fn().mockResolvedValue({
    json: () => Promise.resolve(body),
    ok: status >= 200 && status < 300,
    status,
    text: () => Promise.resolve(JSON.stringify(body)),
  });
}

const { findOrCreateGist, readGist, writeGist } = await import(
  "../../src/lib/gist.js"
);

const emptyGistList = [
  { files: { "something-else.json": { filename: "something-else.json" } }, id: "other1" },
];

const existingGistList = [
  { files: { "something-else.json": { filename: "something-else.json" } }, id: "other1" },
  { files: { "quiver-skill-lock.json": { filename: "quiver-skill-lock.json" } }, id: GIST_ID },
];

const lockFile = {
  dismissed: {},
  lastSelectedAgents: [],
  skills: {
    "frontend-design": {
      installedAt: "2026-01-01T00:00:00Z",
      skillFolderHash: "abc",
      skillPath: "skills/frontend-design/SKILL.md",
      source: "anthropics/skills",
      sourceType: "github",
      sourceUrl: "https://github.com/anthropics/skills.git",
      updatedAt: "2026-01-01T00:00:00Z",
    },
  },
  version: 3,
};

describe("gist lib", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe("findOrCreateGist", () => {
    it("returns existing Gist ID when quiver-skill-lock.json is found", async () => {
      vi.stubGlobal("fetch", mockFetch(200, existingGistList));

      const id = await findOrCreateGist(TOKEN);
      expect(id).toBe(GIST_ID);
    });

    it("creates a new secret Gist and returns its ID when none found", async () => {
      const fetchMock = vi
        .fn()
        .mockResolvedValueOnce({
          json: () => Promise.resolve(emptyGistList),
          ok: true,
          status: 200,
          text: () => Promise.resolve(""),
        })
        .mockResolvedValueOnce({
          json: () => Promise.resolve({ id: "new-gist-id" }),
          ok: true,
          status: 201,
          text: () => Promise.resolve(""),
        });
      vi.stubGlobal("fetch", fetchMock);

      const id = await findOrCreateGist(TOKEN);
      expect(id).toBe("new-gist-id");

      const [, createCall] = fetchMock.mock.calls;
      const body = JSON.parse(createCall[1].body as string);
      expect(body.public).toBe(false);
      expect(body.files["quiver-skill-lock.json"]).toBeDefined();
    });

    it("includes Authorization header on list request", async () => {
      const fetchMock = vi.fn().mockResolvedValueOnce({
        json: () => Promise.resolve(existingGistList),
        ok: true,
        status: 200,
        text: () => Promise.resolve(""),
      });
      vi.stubGlobal("fetch", fetchMock);

      await findOrCreateGist(TOKEN);
      expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe(`Bearer ${TOKEN}`);
    });

    it("throws on GitHub API error", async () => {
      vi.stubGlobal("fetch", mockFetch(401, { message: "Bad credentials" }));

      await expect(findOrCreateGist(TOKEN)).rejects.toThrow("401");
    });
  });

  describe("readGist", () => {
    it("returns parsed SkillLockFile from Gist content", async () => {
      vi.stubGlobal(
        "fetch",
        mockFetch(200, {
          files: {
            "quiver-skill-lock.json": {
              content: JSON.stringify(lockFile),
              filename: "quiver-skill-lock.json",
            },
          },
        }),
      );

      const result = await readGist(GIST_ID, TOKEN);
      expect(result).toEqual(lockFile);
    });

    it("throws when quiver-skill-lock.json file key is missing", async () => {
      vi.stubGlobal(
        "fetch",
        mockFetch(200, { files: { "other.json": { content: "{}", filename: "other.json" } } }),
      );

      await expect(readGist(GIST_ID, TOKEN)).rejects.toThrow(
        "quiver-skill-lock.json not found in Gist",
      );
    });

    it("includes Authorization header", async () => {
      const fetchMock = vi.fn().mockResolvedValue({
        json: () =>
          Promise.resolve({
            files: {
              "quiver-skill-lock.json": {
                content: JSON.stringify(lockFile),
                filename: "quiver-skill-lock.json",
              },
            },
          }),
        ok: true,
        status: 200,
        text: () => Promise.resolve(""),
      });
      vi.stubGlobal("fetch", fetchMock);

      await readGist(GIST_ID, TOKEN);
      expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe(`Bearer ${TOKEN}`);
    });

    it("throws on GitHub API error", async () => {
      vi.stubGlobal("fetch", mockFetch(404, { message: "Not Found" }));

      await expect(readGist(GIST_ID, TOKEN)).rejects.toThrow("404");
    });
  });

  describe("writeGist", () => {
    it("sends PATCH with serialized lock content", async () => {
      const fetchMock = vi.fn().mockResolvedValue({
        json: () => Promise.resolve({}),
        ok: true,
        status: 200,
        text: () => Promise.resolve(""),
      });
      vi.stubGlobal("fetch", fetchMock);

      await writeGist(GIST_ID, lockFile, TOKEN);

      const [url, opts] = fetchMock.mock.calls[0];
      expect(url).toContain(GIST_ID);
      expect(opts.method).toBe("PATCH");

      const body = JSON.parse(opts.body as string);
      expect(body.files["quiver-skill-lock.json"].content).toBe(
        JSON.stringify(lockFile, null, 2),
      );
    });

    it("includes Authorization header", async () => {
      const fetchMock = vi.fn().mockResolvedValue({
        json: () => Promise.resolve({}),
        ok: true,
        status: 200,
        text: () => Promise.resolve(""),
      });
      vi.stubGlobal("fetch", fetchMock);

      await writeGist(GIST_ID, lockFile, TOKEN);
      expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe(`Bearer ${TOKEN}`);
    });

    it("throws when response is not ok", async () => {
      vi.stubGlobal("fetch", mockFetch(422, { message: "Unprocessable Entity" }));

      await expect(writeGist(GIST_ID, lockFile, TOKEN)).rejects.toThrow("422");
    });
  });
});
