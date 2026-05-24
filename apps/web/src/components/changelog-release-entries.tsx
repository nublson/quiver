import { GLYPH, GLYPH_COLOR, SEP_COLOR } from "@/lib/changelog";
import type { Release } from "@/lib/changelog";

export default function ChangelogReleaseEntries({
  release,
}: {
  release: Release;
}) {
  return (
    <div
      className="cl-entries"
      style={{
        border: "1px solid var(--line)",
        borderRadius: 8,
        background: "oklch(0.13 0.006 60)",
        fontFamily: "var(--font-jetbrains-mono)",
        overflow: "hidden",
      }}
    >
      {/* Header bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: 30,
          padding: "0 14px",
          background: "oklch(0.19 0.006 60)",
          borderBottom: "1px solid var(--line)",
          fontSize: 11,
          color: "var(--fg-dim)",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}
      >
        <span>{release.bumpLabel}</span>
        <span
          style={{
            display: "inline-flex",
            gap: 12,
            textTransform: "none",
            letterSpacing: "0.02em",
          }}
        >
          {release.stats.add != null && (
            <span style={{ color: "var(--green)" }}>+{release.stats.add}</span>
          )}
          {release.stats.chg != null && (
            <span style={{ color: "var(--accent)" }}>~{release.stats.chg}</span>
          )}
          {release.stats.fix != null && (
            <span style={{ color: "var(--blue)" }}>✓{release.stats.fix}</span>
          )}
          {release.stats.rm != null && (
            <span style={{ color: "var(--red)" }}>−{release.stats.rm}</span>
          )}
        </span>
      </div>

      {/* Flat list: section separator + entries interleaved */}
      <ul
        style={{
          listStyle: "none",
          margin: 0,
          padding: "12px 0",
          fontSize: 13.5,
          lineHeight: 1.55,
        }}
      >
        {release.sections.flatMap((section, si) => [
          <li
            key={`sep-${si}`}
            style={{
              display: "grid",
              gridTemplateColumns: "28px 1fr",
              gap: 10,
              padding: si === 0 ? "4px 18px" : "8px 18px 4px",
              fontSize: 10.5,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: SEP_COLOR[section.type],
              borderTop: si === 0 ? "none" : "1px solid var(--line)",
              marginTop: si === 0 ? 0 : 6,
            }}
          >
            <span style={{ textAlign: "center" }}>{GLYPH[section.type]}</span>
            <span>{section.label}</span>
          </li>,
          ...section.entries.map((entry, ei) => (
            <li
              key={`entry-${si}-${ei}`}
              style={{
                display: "grid",
                gridTemplateColumns: "28px 1fr",
                gap: 10,
                padding: "5px 18px",
                color: "var(--fg-mute)",
              }}
            >
              <span
                style={{
                  textAlign: "center",
                  fontWeight: 600,
                  userSelect: "none",
                  paddingTop: 1,
                  color: GLYPH_COLOR[entry.type],
                }}
              >
                {GLYPH[entry.type]}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-jetbrains-mono)",
                  fontSize: 13.5,
                }}
              >
                {entry.text}
              </span>
            </li>
          )),
        ])}
      </ul>
    </div>
  );
}
