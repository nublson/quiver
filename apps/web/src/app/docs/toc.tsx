"use client";

import { useEffect, useRef, useState } from "react";
import type { TOCItemType } from "fumadocs-core/toc";

interface DocsTOCProps {
  items: TOCItemType[];
}

export default function DocsTOC({ items }: DocsTOCProps) {
  const [active, setActive] = useState<string>("");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current?.disconnect();

    const headings = items.flatMap((item) => {
      const id = item.url.slice(1);
      const el = document.getElementById(id);
      return el ? [el] : [];
    });

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
          setActive(visible[0].target.id);
        }
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 }
    );

    headings.forEach((el) => observerRef.current!.observe(el));

    if (location.hash) {
      setActive(location.hash.slice(1));
    }

    return () => observerRef.current?.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <aside className="docs-toc">
      <div className="docs-toc-label">On this page</div>
      <ul className="docs-toc-list">
        {items.map((item) => {
          const id = item.url.slice(1);
          const isActive = active === id;
          const isSub = item.depth > 2;
          return (
            <li key={item.url}>
              <a
                href={item.url}
                className={[isActive ? "active" : "", isSub ? "sub" : ""]
                  .filter(Boolean)
                  .join(" ")}
              >
                {item.title}
              </a>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
