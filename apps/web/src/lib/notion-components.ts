import { NotionCallout } from "@/components/notion-callout";
import { NotionCode } from "@/components/notion-code";
import { NotionTable } from "@/components/notion-table";
import { NotionToggle } from "@/components/notion-toggle";

/** The shadcn/ui versions from notionic's registry, used across the site. */
export const notionComponents = {
  code: NotionCode,
  callout: NotionCallout,
  table: NotionTable,
  toggle: NotionToggle,
};

/**
 * Files uploaded to Notion go through the file route, which re-signs their
 * URLs (Notion's expire after an hour, longer than pages are cached).
 */
export function notionFileUrl({ blockId }: { blockId: string }) {
  return `/api/notion/file/${blockId}`;
}
