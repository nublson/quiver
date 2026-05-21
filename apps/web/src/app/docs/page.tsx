import { SectionLabel } from "@/components/section-label";

export const metadata = {
  title: "Docs — Quiver",
  description:
    "Documentation for Quiver, the CLI sync layer for AI agent skills.",
};

export default function DocsPage() {
  return (
    <div style={{ position: "relative", zIndex: 1 }}>
      <div
        className="container-site"
        style={{ padding: "96px 0", width: "100%" }}
      >
        <SectionLabel>Documentation</SectionLabel>

        <h1
          style={{
            fontFamily: "var(--font-jetbrains-mono)",
            fontSize: "clamp(28px, 3.4vw, 48px)",
            letterSpacing: "-0.025em",
            fontWeight: 600,
            marginBottom: 24,
            maxWidth: "20ch",
            textWrap: "balance",
          }}
        >
          Docs coming soon.
        </h1>

        <p
          style={{
            fontSize: 17,
            color: "var(--fg-mute)",
            maxWidth: "52ch",
            lineHeight: 1.6,
            marginBottom: 48,
          }}
        >
          Full documentation is on the way. In the meantime, the{" "}
          <a
            href="https://github.com/nublson/quiver"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "var(--accent)",
              borderBottom: "1px solid var(--accent)",
            }}
          >
            GitHub README
          </a>{" "}
          covers installation, commands, and how sync works under the hood.
        </p>

        <a
          href="https://github.com/nublson/quiver"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontFamily: "var(--font-jetbrains-mono)",
            fontSize: 12.5,
            fontWeight: 500,
            padding: "8px 14px",
            borderRadius: 6,
            border: "1px solid var(--line-strong)",
            background: "var(--bg-elev)",
            color: "var(--fg)",
            whiteSpace: "nowrap",
            transition: "all 0.12s ease",
            cursor: "pointer",
          }}
        >
          View on GitHub →
        </a>
      </div>
    </div>
  );
}
