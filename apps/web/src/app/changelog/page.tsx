import ChangelogRail from "@/components/changelog-rail";
import ChangelogReleaseArticle from "@/components/changelog-release-article";
import PageBreadcrumb from "@/components/page-breadcrumb";
import { entryCodeStyle } from "@/lib/changelog";
import { RELEASES } from "@/lib/changelog-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Changelog — Quiver",
  description:
    "Release notes for Quiver — the CLI sync layer for AI agent skills. Versions, dates, and what changed in each one.",
};

/* Hoisted — static, never re-created (rendering-hoist-jsx) */
const LEGEND_ITEMS = [
  { glyph: "+", color: "var(--green)", label: "added" },
  { glyph: "~", color: "var(--accent)", label: "changed" },
  { glyph: "✓", color: "var(--blue)", label: "fixed" },
  { glyph: "−", color: "var(--red)", label: "removed" },
] as const;

export default function ChangelogPage() {
  return (
    <div
      className="cl-shell"
      style={{
        maxWidth: 1240,
        margin: "0 auto",
        padding: "32px 32px 96px",
        display: "grid",
        gridTemplateColumns: "220px minmax(0, 1fr)",
        gap: 56,
        alignItems: "start",
        position: "relative",
        zIndex: 1,
      }}
    >
      <ChangelogRail />

      <main style={{ minWidth: 0 }}>
        {/* ── Header ── */}
        <header className="docs-header">
          <PageBreadcrumb label="changelog" />
          <h1>
            What&apos;s <span style={{ color: "var(--accent)" }}>new</span> in
            Quiver
          </h1>

          <p>
            Every release that&apos;s shipped to npm, with the diff you&apos;d
            actually care about — new commands, breaking changes, and the small
            things that made <code style={entryCodeStyle}>quiver sync</code> a
            little quieter.
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 18,
              marginTop: 28,
              fontFamily: "var(--font-jetbrains-mono)",
              fontSize: 12,
              color: "var(--fg-mute)",
            }}
          >
            {LEGEND_ITEMS.map(({ glyph, color, label }) => (
              <span
                key={label}
                style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: 16,
                    textAlign: "center",
                    fontWeight: 600,
                    color,
                  }}
                >
                  {glyph}
                </span>
                {label}
              </span>
            ))}
          </div>
        </header>

        {/* ── Unreleased / next ── */}
        {/* <ChangelogUnreleased /> */}

        {/* ── Release stream ── */}
        {RELEASES.map((release) => (
          <ChangelogReleaseArticle key={release.id} release={release} />
        ))}

        {/* ── End line ── */}
        <div
          style={{
            marginTop: 24,
            paddingLeft: 40,
            fontFamily: "var(--font-jetbrains-mono)",
            fontSize: 12.5,
            color: "var(--fg-dim)",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span style={{ color: "var(--accent)" }}>$</span>
          <span>
            that&apos;s all the history.{" "}
            <a
              href="https://github.com/nublson/quiver/commits/main"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "var(--accent)",
                borderBottom: "1px solid oklch(0.78 0.14 75 / 0.4)",
              }}
            >
              browse commits →
            </a>
          </span>
          <span
            style={{
              display: "inline-block",
              width: 8,
              height: 14,
              background: "var(--fg-dim)",
              verticalAlign: -2,
              animation: "blink 1.05s steps(1) infinite",
            }}
          />
        </div>
      </main>
    </div>
  );
}
