import { source } from "@/lib/source";
import type { Root as PageTreeRoot, Node } from "fumadocs-core/page-tree";
import type { TOCItemType } from "fumadocs-core/toc";
import Link from "next/link";
import DocsTOC from "./toc";
import Callout from "@/components/docs/callout";
import CmdRef from "@/components/docs/cmd-ref";
import Terminal from "@/components/docs/terminal";

/** Derive a unique anchor from a page's slug array. */
function pageAnchor(slugs: string[]): string {
  return slugs.at(-1) ?? "introduction";
}

type PageEntry = ReturnType<typeof source.getPages>[number];

/**
 * Walk the page tree (which respects meta.json ordering) and return
 * page objects in the correct display order.
 */
function getOrderedPages(
  tree: PageTreeRoot,
  pageMap: Map<string, PageEntry>
): PageEntry[] {
  const ordered: PageEntry[] = [];

  function walk(node: Node) {
    if (node.type === "page") {
      const page = pageMap.get(node.url);
      if (page) ordered.push(page);
    } else if (node.type === "folder") {
      node.children.forEach(walk);
    }
  }

  tree.children.forEach(walk);
  return ordered;
}

export const metadata = {
  title: "Documentation — Quiver",
  description:
    "Everything you need to sync your AI agent skills across machines.",
};

export default async function DocsPage() {
  const pageMap = new Map(source.getPages().map((p) => [p.url, p]));
  const allPages = getOrderedPages(source.pageTree, pageMap);
  const rootPage = pageMap.get("/docs"); // index.mdx — used for top-level lede

  const toc: TOCItemType[] = allPages.map((page) => ({
    title: page.data.title,
    url: `#${pageAnchor(page.slugs)}`,
    depth: 2,
  }));

  return (
    <div className="docs-content-shell">
      <main className="docs-main">
        {/* Page-level header */}
        <div className="docs-header">
          <nav className="docs-breadcrumb" aria-label="breadcrumb">
            <Link href="/">~/</Link>
            <span className="sep">/</span>
            <span className="current">docs</span>
          </nav>
          <h1>Documentation</h1>
          {rootPage?.data.description && (
            <p className="lede">{rootPage.data.description}</p>
          )}
        </div>

        {/* All pages rendered as scrollable sections */}
        {allPages.map((page) => {
          const MDXContent = page.data.body;
          const anchor = pageAnchor(page.slugs);
          return (
            <section key={page.url} id={anchor} className="docs-section">
              <h2>{page.data.title}</h2>
              <MDXContent components={{ Callout, CmdRef, Terminal }} />
            </section>
          );
        })}
      </main>

      <DocsTOC items={toc} />
    </div>
  );
}
