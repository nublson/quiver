import { RiRssLine } from "@remixicon/react";

export default function ChangelogUnreleased() {
  return (
    <div
      className="cl-unreleased"
      style={{
        border: "1px dashed var(--line-strong)",
        background:
          "repeating-linear-gradient(135deg, transparent 0 12px, oklch(0.20 0.006 60 / 0.4) 12px 13px), var(--bg-elev)",
        borderRadius: 10,
        padding: "22px 24px",
        marginBottom: 56,
        display: "grid",
        gridTemplateColumns: "auto 1fr auto",
        gap: 20,
        alignItems: "center",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-jetbrains-mono)",
          fontSize: 10.5,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--accent)",
          padding: "4px 10px",
          border: "1px solid var(--accent)",
          borderRadius: 999,
          background: "var(--accent-dim)",
          width: "fit-content",
        }}
      >
        next
      </span>

      <div
        style={{
          fontFamily: "var(--font-jetbrains-mono)",
          fontSize: 13,
          color: "var(--fg-mute)",
          lineHeight: 1.55,
        }}
      >
        <strong style={{ color: "var(--fg)", fontWeight: 600 }}>
          v0.3.0 — Teams &amp; shared lock files.
        </strong>{" "}
        Tracking the team-shared skill set work in{" "}
        <a
          href="https://github.com/nublson/quiver/issues/14"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "var(--accent)",
            borderBottom: "1px solid oklch(0.78 0.14 75 / 0.4)",
          }}
        >
          #14
        </a>
        . Design feedback welcome; expected late June.
      </div>

      <a
        href="#"
        style={{
          fontFamily: "var(--font-jetbrains-mono)",
          fontSize: 11.5,
          color: "var(--fg-mute)",
          padding: "8px 12px",
          border: "1px solid var(--line-strong)",
          background: "var(--bg)",
          borderRadius: 6,
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          whiteSpace: "nowrap",
          transition: "all 0.12s ease",
          textDecoration: "none",
          width: "fit-content",
        }}
      >
        <RiRssLine className="size-4" />
        rss feed
      </a>
    </div>
  );
}
