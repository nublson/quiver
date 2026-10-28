import "server-only";

import type { NotionBlock } from "notionic";
import { fetchBlocks } from "notionic/fetch";
import { notionClient } from "./notion";

/**
 * The blocks of a standalone Notion page (the landing page's body), or none
 * without NOTION_TOKEN or the page id, or when Notion can't be reached, so
 * the page never fails on Notion.
 */
export async function getPageBlocks(pageId: string | undefined): Promise<NotionBlock[]> {
  const client = notionClient();
  if (!client || !pageId) {
    console.warn("[notion] NOTION_TOKEN or a page id is not set; rendering without Notion content.");
    return [];
  }
  try {
    return await fetchBlocks(client, pageId, { linkFavicons: true });
  } catch (error) {
    console.error(`Could not fetch the Notion page ${pageId}.`, error);
    return [];
  }
}
