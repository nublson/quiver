import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("node:fs/promises", () => ({
  mkdir: vi.fn().mockResolvedValue(),
  readFile: vi.fn(),
  writeFile: vi.fn().mockResolvedValue(),
}));

// Import after mocking
const fsMock = await import("node:fs/promises");
const { CREDENTIALS_PATH, readCredentials, writeCredentials } = await import(
  "../../src/lib/credentials.js"
);

const validCredentials = {
  gistId: "abc123",
  githubToken: "ghp_xyz",
  token: "sess_abc",
  username: "octocat",
};

describe("credentials lib", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("readCredentials", () => {
    it("returns null when credentials file does not exist", async () => {
      const err = Object.assign(new Error("not found"), { code: "ENOENT" });
      vi.mocked(fsMock.readFile).mockRejectedValueOnce(err);

      const result = await readCredentials();
      expect(result).toBeNull();
    });

    it("returns parsed credentials on success", async () => {
      vi.mocked(fsMock.readFile).mockResolvedValueOnce(
        JSON.stringify(validCredentials) as unknown as Buffer,
      );

      const result = await readCredentials();
      expect(result).toEqual(validCredentials);
    });

    it("re-throws non-ENOENT errors", async () => {
      const err = Object.assign(new Error("permission denied"), { code: "EACCES" });
      vi.mocked(fsMock.readFile).mockRejectedValueOnce(err);

      await expect(readCredentials()).rejects.toThrow("permission denied");
    });

    it("re-throws JSON parse errors", async () => {
      vi.mocked(fsMock.readFile).mockResolvedValueOnce(
        "not valid json" as unknown as Buffer,
      );

      await expect(readCredentials()).rejects.toThrow();
    });
  });

  describe("writeCredentials", () => {
    it("calls mkdir with recursive: true before writing", async () => {
      await writeCredentials(validCredentials);

      expect(fsMock.mkdir).toHaveBeenCalledWith(
        expect.stringContaining(".quiver"),
        { recursive: true },
      );
    });

    it("writes to CREDENTIALS_PATH", async () => {
      await writeCredentials(validCredentials);

      expect(fsMock.writeFile).toHaveBeenCalledWith(
        CREDENTIALS_PATH,
        expect.any(String),
        "utf8",
      );
    });

    it("writes 2-space indented JSON", async () => {
      await writeCredentials(validCredentials);

      const written = vi.mocked(fsMock.writeFile).mock.calls[0][1] as string;
      expect(written).toBe(JSON.stringify(validCredentials, null, 2));
    });

    it("writes credentials without gistId when absent", async () => {
      const noGist = { githubToken: "g", token: "t", username: "u" };
      await writeCredentials(noGist);

      const written = vi.mocked(fsMock.writeFile).mock.calls[0][1] as string;
      expect(JSON.parse(written)).toEqual(noGist);
    });
  });
});
