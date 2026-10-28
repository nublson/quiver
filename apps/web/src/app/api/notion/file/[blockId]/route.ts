import { isFullBlock } from "@notionhq/client";
import { NextResponse } from "next/server";
import { getDocs } from "@/lib/docs";
import { notionClient } from "@/lib/notion";

export const runtime = "nodejs";

const BLOCK_ID = /^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i;

/** Longest the CDN may serve a redirect, and how long before expiry it must stop. */
const MAX_CACHE_SECONDS = 30 * 60;
const SAFETY_SECONDS = 5 * 60;

/** How many parent blocks (toggles, columns…) to climb to reach the block's page. */
const MAX_DEPTH = 10;

type HostedFile = { url: string; expiry_time: string };
type Parent = { type: string; page_id?: string; block_id?: string };

const normalize = (id: string) => id.replace(/-/g, "").toLowerCase();

/** The uploaded file of a media block (image, video, file…), or of a block's icon. */
function hostedFile(block: Record<string, unknown> & { type: string }): HostedFile | null {
  const payload = block[block.type] as
    | { type?: string; file?: HostedFile; icon?: { type?: string; file?: HostedFile } | null }
    | undefined;
  if (payload?.type === "file" && payload.file) return payload.file;
  if (payload?.icon?.type === "file" && payload.icon.file) return payload.icon.file;
  return null;
}

/** The id of the page a block sits on, climbing through its parent blocks. */
async function pageOf(
  client: NonNullable<ReturnType<typeof notionClient>>,
  parent: Parent,
): Promise<string | null> {
  for (let depth = 0; depth < MAX_DEPTH; depth++) {
    if (parent.type === "page_id" && parent.page_id) return normalize(parent.page_id);
    if (parent.type !== "block_id" || !parent.block_id) return null;
    const block = await client.blocks.retrieve({ block_id: parent.block_id });
    if (!isFullBlock(block)) return null;
    parent = block.parent as Parent;
  }
  return null;
}

/** Whether the site shows this page: the landing page or a published doc. */
async function isPublished(pageId: string): Promise<boolean> {
  const landing = process.env.NOTION_PAGE_ID;
  if (landing && normalize(landing) === pageId) return true;
  return (await getDocs()).some((doc) => doc.id === pageId);
}

/**
 * Redirects to a fresh signed URL for a file uploaded to Notion. Those URLs
 * expire after an hour, so pages link here (via `transformFileUrl`) instead:
 * each request looks the block up again. The redirect is cached on the CDN
 * for at most 30 minutes, and never past 5 minutes before the URL expires.
 * Only blocks on the landing page or a published doc are reachable, so a
 * saved link stops working once its doc is unpublished.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ blockId: string }> }) {
  const { blockId } = await params;
  const client = notionClient();
  if (!client || !BLOCK_ID.test(blockId)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let file: HostedFile | null = null;
  try {
    const block = await client.blocks.retrieve({ block_id: blockId });
    if (isFullBlock(block)) {
      const candidate = hostedFile(block as unknown as Record<string, unknown> & { type: string });
      const pageId = candidate ? await pageOf(client, block.parent as Parent) : null;
      if (pageId && (await isPublished(pageId))) file = candidate;
    }
  } catch {
    // Missing, or not shared with the integration.
  }
  if (!file) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const secondsLeft = Math.floor((Date.parse(file.expiry_time) - Date.now()) / 1000);
  const cacheSeconds = Math.max(0, Math.min(MAX_CACHE_SECONDS, secondsLeft - SAFETY_SECONDS));
  const response = NextResponse.redirect(file.url, 307);
  // Browsers ask again each time; the CDN answers until shortly before the URL expires.
  response.headers.set("Cache-Control", `public, max-age=0, s-maxage=${cacheSeconds}`);
  return response;
}
