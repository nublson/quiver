import ChangelogReleaseEntries from "@/components/changelog-release-entries";
import { TAG_STYLE } from "@/lib/changelog";
import type { Release } from "@/lib/changelog";

export default function ChangelogReleaseArticle({
  release,
}: {
  release: Release;
}) {
  const tagStyle = release.tag ? TAG_STYLE[release.tag] : null;
  const articleClass = [
    "cl-release",
    release.tag === "latest" ? "cl-latest" : "",
    release.tag === "major" || release.tag === "initial" ? "cl-major" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <article id={release.id} className={articleClass}>
      {/* Version row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 14,
          marginBottom: 8,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-jetbrains-mono)",
            fontSize: 26,
            fontWeight: 600,
            letterSpacing: "-0.02em",
            color: "var(--fg)",
          }}
        >
          <span style={{ color: "var(--fg-dim)", fontWeight: 400 }}>v</span>
          {release.version}
        </span>

        {tagStyle && (
          <span
            style={{
              fontFamily: "var(--font-jetbrains-mono)",
              fontSize: 10.5,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              padding: "3px 9px",
              borderRadius: 999,
              border: `1px solid ${tagStyle.borderColor}`,
              color: tagStyle.color,
              background: tagStyle.background,
            }}
          >
            {release.tag}
          </span>
        )}

        <span
          style={{
            fontFamily: "var(--font-jetbrains-mono)",
            fontSize: 11,
            color: "var(--fg-dim)",
            padding: "2px 8px",
            border: "1px solid var(--line)",
            borderRadius: 4,
            background: "var(--bg-elev)",
          }}
        >
          {release.sha}
        </span>

        <span
          className="cl-release-date-mobile"
          style={{
            fontFamily: "var(--font-jetbrains-mono)",
            fontSize: 12,
            color: "var(--fg-dim)",
            letterSpacing: "0.02em",
            marginLeft: "auto",
          }}
        >
          {release.date}
        </span>
      </div>

      {/* Permalink path */}
      <span
        style={{
          fontFamily: "var(--font-jetbrains-mono)",
          fontSize: 11,
          color: "var(--fg-dim)",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          marginBottom: 18,
          display: "block",
        }}
      >
        /changelog/v{release.version}
      </span>

      {/* Summary */}
      <p
        className="cl-summary"
        style={{
          fontSize: 15.5,
          lineHeight: 1.6,
          color: "var(--fg-mute)",
          maxWidth: "64ch",
          marginBottom: 22,
        }}
      >
        {release.summary}
      </p>

      <ChangelogReleaseEntries release={release} />
    </article>
  );
}
