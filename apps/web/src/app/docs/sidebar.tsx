"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Root, Node, Folder, Item } from "fumadocs-core/page-tree";

interface SidebarProps {
  tree: Root;
}

export default function DocsSidebar({ tree }: SidebarProps) {
  const pathname = usePathname();

  // Split root children into: leading pages → "Getting Started", then folders
  const leadingPages: Item[] = [];
  const folders: Folder[] = [];

  for (const node of tree.children) {
    if (node.type === "page") {
      if (folders.length === 0) {
        leadingPages.push(node as Item);
      }
    } else if (node.type === "folder") {
      folders.push(node as Folder);
    }
  }

  return (
    <aside className="docs-side">
      {/* Implicit "Getting Started" group for root-level pages */}
      {leadingPages.length > 0 && (
        <div className="docs-side-group">
          <div className="docs-side-label">Getting Started</div>
          <ul className="docs-side-list">
            {leadingPages.map((page, i) => (
              <li key={i}>
                <Link
                  href={page.url}
                  className={pathname === page.url ? "active" : ""}
                >
                  {page.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Folder groups */}
      {folders.map((folder, i) => (
        <div key={i} className="docs-side-group">
          <div className="docs-side-label">{folder.name}</div>
          <ul className="docs-side-list">
            {folder.children
              .filter((n): n is Item => n.type === "page")
              .map((page, j) => (
                <li key={j}>
                  <Link
                    href={page.url}
                    className={pathname === page.url ? "active" : ""}
                  >
                    {page.name}
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </aside>
  );
}
