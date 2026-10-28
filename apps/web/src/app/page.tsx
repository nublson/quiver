import { NotionRenderer } from "notionic";
import { Hero } from "@/components/hero";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { notionComponents, notionFileUrl } from "@/lib/notion-components";
import { getPageBlocks } from "@/lib/pages";

// The page is cached and rebuilt in the background at most once an hour, so
// visits don't call the Notion API.
export const revalidate = 3600;

export default async function Home() {
  // Everything below the hero is the Notion page in NOTION_PAGE_ID.
  const blocks = await getPageBlocks(process.env.NOTION_PAGE_ID);
  return (
    <div className="mx-auto flex min-h-svh max-w-3xl flex-col px-4">
      <SiteHeader />

      <main id="main" className="flex-1">
        <Hero />

        <section className="pb-16">
          <NotionRenderer
            blocks={blocks}
            components={notionComponents}
            transformFileUrl={notionFileUrl}
            linkFavicons
          />
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
