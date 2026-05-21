"use client";

import { useEffect, useRef, useState } from "react";
import type { Root, Folder, Item } from "fumadocs-core/page-tree";

/** Derive anchor from a page tree item URL: /docs/commands/push → "push" */
function urlToAnchor(url: string): string {
  const parts = url.replace(/^\/docs\/?/, "").split("/").filter(Boolean);
  return parts.at(-1) || "introduction";
}

interface SidebarProps {
  tree: Root;
}

export default function DocsSidebar({ tree }: SidebarProps) {
  const [active, setActive] = useState<string>("introduction");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current?.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              a.target.getBoundingClientRect().top -
              b.target.getBoundingClientRect().top
          );
        if (visible.length > 0) {
          setActive((visible[0].target as HTMLElement).id);
        }
      },
      { rootMargin: "-80px 0px -55% 0px", threshold: 0 }
    );

    document
      .querySelectorAll<HTMLElement>("section[id]")
      .forEach((el) => observerRef.current!.observe(el));

    return () => observerRef.current?.disconnect();
  }, []);

  // Split root children into leading pages (→ Getting Started) and folders
  const leadingPages: Item[] = [];
  const folders: Folder[] = [];

  for (const node of tree.children) {
    if (node.type === "page") {
      if (folders.length === 0) leadingPages.push(node as Item);
    } else if (node.type === "folder") {
      folders.push(node as Folder);
    }
  }

  return (
    <aside className="docs-side">
      {leadingPages.length > 0 && (
        <div className="docs-side-group">
          <div className="docs-side-label">Getting Started</div>
          <ul className="docs-side-list">
            {leadingPages.map((page, i) => {
              const anchor = urlToAnchor(page.url);
              return (
                <li key={i}>
                  <a
                    href={`#${anchor}`}
                    className={active === anchor ? "active" : ""}
                  >
                    {page.name}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {folders.map((folder, i) => (
        <div key={i} className="docs-side-group">
          <div className="docs-side-label">{folder.name}</div>
          <ul className="docs-side-list">
            {folder.children
              .filter((n): n is Item => n.type === "page")
              .map((page, j) => {
                const anchor = urlToAnchor(page.url);
                return (
                  <li key={j}>
                    <a
                      href={`#${anchor}`}
                      className={active === anchor ? "active" : ""}
                    >
                      {page.name}
                    </a>
                  </li>
                );
              })}
          </ul>
        </div>
      ))}
    </aside>
  );
}
