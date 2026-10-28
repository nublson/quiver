import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const retrieve = vi.fn();
const getDocs = vi.fn();
vi.mock("server-only", () => ({}));
vi.mock("@/lib/docs", () => ({ getDocs }));
vi.mock("@notionhq/client", () => ({
  Client: class {
    blocks = { retrieve };
  },
  isFullBlock: (block: { type?: string }) => "type" in block,
}));

const { GET } = await import("./route");

const ID = "3fcb1726-8ab3-81d7-b265-ff9229b44af9";
const call = (blockId: string) =>
  GET(new Request("http://localhost/x"), { params: Promise.resolve({ blockId }) });
const inMinutes = (minutes: number) => new Date(Date.now() + minutes * 60_000).toISOString();
const signed = "https://prod-files-secure.s3.amazonaws.com/a.png?X-Amz-Signature=fresh";
const DOC = "3fcb1726-8ab3-8000-b265-000000000001";
const LANDING = "3fcb1726-8ab3-8000-b265-000000000002";
const onPage = (pageId: string) => ({ type: "page_id", page_id: pageId });

describe("GET /api/notion/file/[blockId]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("NOTION_TOKEN", "secret_test");
    vi.stubEnv("NOTION_PAGE_ID", LANDING.replace(/-/g, ""));
    getDocs.mockResolvedValue([{ id: DOC.replace(/-/g, "") }]);
  });
  afterEach(() => vi.unstubAllEnvs());

  it("redirects to a fresh signed URL for an uploaded image", async () => {
    retrieve.mockResolvedValue({
      parent: onPage(DOC),
      type: "image",
      image: { type: "file", file: { url: signed, expiry_time: inMinutes(60) } },
    });
    const res = await call(ID);
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe(signed);
    expect(res.headers.get("cache-control")).toBe("public, max-age=0, s-maxage=1800");
    expect(retrieve).toHaveBeenCalledWith({ block_id: ID });
  });

  it("caches only until shortly before the URL expires", async () => {
    retrieve.mockResolvedValue({
      parent: onPage(DOC),
      type: "file",
      file: { type: "file", file: { url: signed, expiry_time: inMinutes(10) } },
    });
    const res = await call(ID);
    const maxAge = Number(res.headers.get("cache-control")?.match(/s-maxage=(\d+)/)?.[1]);
    expect(maxAge).toBeGreaterThan(290);
    expect(maxAge).toBeLessThanOrEqual(300);
  });

  it("serves an uploaded callout icon", async () => {
    retrieve.mockResolvedValue({
      parent: onPage(LANDING),
      type: "callout",
      callout: { icon: { type: "file", file: { url: signed, expiry_time: inMinutes(60) } } },
    });
    expect((await call(ID)).headers.get("location")).toBe(signed);
  });

  it("climbs through parent blocks to the block's page", async () => {
    retrieve
      .mockResolvedValueOnce({
        parent: { type: "block_id", block_id: "toggle" },
        type: "image",
        image: { type: "file", file: { url: signed, expiry_time: inMinutes(60) } },
      })
      .mockResolvedValueOnce({ parent: onPage(DOC), type: "toggle", toggle: {} });
    expect((await call(ID)).headers.get("location")).toBe(signed);
    expect(retrieve).toHaveBeenLastCalledWith({ block_id: "toggle" });
  });

  it("returns 404 for files on unpublished or unknown pages", async () => {
    retrieve.mockResolvedValue({
      parent: onPage("3fcb1726-8ab3-8000-b265-000000000099"),
      type: "image",
      image: { type: "file", file: { url: signed, expiry_time: inMinutes(60) } },
    });
    expect((await call(ID)).status).toBe(404);
  });

  it("returns 404 for external files, blocks without files, unreadable blocks and bad ids", async () => {
    retrieve.mockResolvedValueOnce({
      type: "image",
      image: { type: "external", external: { url: "https://x.y/a.png" } },
    });
    expect((await call(ID)).status).toBe(404);
    retrieve.mockResolvedValueOnce({ type: "paragraph", paragraph: { rich_text: [], icon: null } });
    expect((await call(ID)).status).toBe(404);
    retrieve.mockRejectedValueOnce(new Error("object_not_found"));
    expect((await call(ID)).status).toBe(404);
    expect((await call("../../etc/passwd")).status).toBe(404);
    expect(retrieve).toHaveBeenCalledTimes(3);
  });

  it("returns 404 without a Notion token", async () => {
    vi.stubEnv("NOTION_TOKEN", "");
    expect((await call(ID)).status).toBe(404);
    expect(retrieve).not.toHaveBeenCalled();
  });
});
