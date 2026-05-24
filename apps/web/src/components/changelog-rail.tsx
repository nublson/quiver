"use client";

import { useEffect, useRef, useState } from "react";

const RELEASES = [
  { id: "v0-2-4", version: "0.2.4", date: "May 18" },
  { id: "v0-2-3", version: "0.2.3", date: "Apr 30" },
  { id: "v0-2-2", version: "0.2.2", date: "Apr 14" },
  { id: "v0-2-1", version: "0.2.1", date: "Mar 28" },
  { id: "v0-2-0", version: "0.2.0", date: "Mar 10" },
  { id: "v0-1-2", version: "0.1.2", date: "Feb 22" },
  { id: "v0-1-1", version: "0.1.1", date: "Feb 05" },
  { id: "v0-1-0", version: "0.1.0", date: "Jan 22" },
];

export default function ChangelogRail() {
  const [activeId, setActiveId] = useState("v0-2-4");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (location.hash) setActiveId(location.hash.slice(1));

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              a.target.getBoundingClientRect().top -
              b.target.getBoundingClientRect().top
          );
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-90px 0px -70% 0px", threshold: 0 }
    );

    RELEASES.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observerRef.current!.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <aside
      className="cl-rail"
      style={{
        position: "sticky",
        top: 84,
        fontFamily: "var(--font-jetbrains-mono)",
        fontSize: 12.5,
        maxHeight: "calc(100vh - 100px)",
        overflowY: "auto",
        paddingRight: 6,
      }}
    >
      <div
        style={{
          fontSize: 10.5,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--fg-dim)",
          marginBottom: 14,
          paddingLeft: 14,
        }}
      >
        Releases
      </div>

      <ul
        style={{
          listStyle: "none",
          display: "flex",
          flexDirection: "column",
          gap: 0,
          borderLeft: "1px solid var(--line)",
          margin: 0,
          padding: 0,
        }}
      >
        {RELEASES.map(({ id, version, date }) => {
          const isActive = activeId === id;
          return (
            <li key={id} style={{ marginLeft: -1 }}>
              <a
                href={`#${id}`}
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                  gap: 10,
                  padding: "8px 14px",
                  borderLeft: isActive
                    ? "1px solid var(--accent)"
                    : "1px solid transparent",
                  color: isActive ? "var(--accent)" : "var(--fg-mute)",
                  background: isActive ? "var(--accent-dim)" : "transparent",
                  transition: "all 0.12s ease",
                  textDecoration: "none",
                }}
              >
                <span style={{ fontWeight: 600 }}>{version}</span>
                <span
                  style={{
                    fontSize: 11,
                    color: isActive
                      ? "oklch(0.78 0.14 75 / 0.7)"
                      : "var(--fg-dim)",
                  }}
                >
                  {date}
                </span>
              </a>
            </li>
          );
        })}
      </ul>

      <div
        style={{
          marginTop: 24,
          padding: "12px 14px",
          border: "1px dashed var(--line-strong)",
          borderRadius: 6,
          fontSize: 11.5,
          color: "var(--fg-dim)",
          lineHeight: 1.5,
        }}
      >
        Follows{" "}
        <a
          href="https://keepachangelog.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "var(--accent)",
            borderBottom: "1px solid oklch(0.78 0.14 75 / 0.4)",
          }}
        >
          Keep a Changelog
        </a>{" "}
        and{" "}
        <a
          href="https://semver.org"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "var(--accent)",
            borderBottom: "1px solid oklch(0.78 0.14 75 / 0.4)",
          }}
        >
          SemVer
        </a>
        . Dates are UTC.
      </div>
    </aside>
  );
}
