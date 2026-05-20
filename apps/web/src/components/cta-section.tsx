import InstallPill from "@/components/install-pill";

function ArrowIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38v-1.33c-2.22.48-2.69-1.07-2.69-1.07-.36-.92-.89-1.17-.89-1.17-.73-.5.05-.49.05-.49.81.06 1.23.83 1.23.83.72 1.23 1.88.87 2.34.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.13 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.11.16 1.93.08 2.13.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.74.54 1.49v2.21c0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

export default function CTASection() {
  return (
    <section style={{ padding: "96px 0", position: "relative" }}>
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 32px" }}>
        <div
          className="cta-grid"
          style={{
            border: "1px solid var(--line)",
            background: "radial-gradient(circle at 80% 20%, oklch(0.78 0.14 75 / 0.10), transparent 50%), var(--bg-elev)",
            borderRadius: 14,
            padding: "56px 48px",
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: 40,
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                fontFamily: "var(--font-jetbrains-mono)",
                fontSize: 11.5,
                letterSpacing: "0.08em",
                color: "var(--accent)",
                textTransform: "uppercase",
                marginBottom: 14,
              }}
            >
              <span style={{ width: 16, height: 1, background: "var(--accent)", display: "inline-block" }} />
              04 / Get it
            </div>

            <h3
              style={{
                fontFamily: "var(--font-jetbrains-mono)",
                fontSize: 28,
                fontWeight: 600,
                letterSpacing: "-0.02em",
                marginBottom: 10,
                textWrap: "balance",
              }}
            >
              Stop reinstalling skills. Start syncing them.
            </h3>

            <p style={{ color: "var(--fg-mute)", maxWidth: "50ch" }}>
              Quiver is free and open source. Install the CLI, run{" "}
              <code
                style={{
                  fontFamily: "var(--font-jetbrains-mono)",
                  color: "var(--accent)",
                }}
              >
                quiver login
              </code>{" "}
              once, and your global skills follow you to every machine you sign
              in on.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              alignItems: "stretch",
              minWidth: 240,
            }}
          >
            <InstallPill cmd="npm install -g usequiver" />
            <div style={{ display: "flex", gap: 10 }}>
              <a
                href="/docs"
                style={{
                  flex: 1,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  fontFamily: "var(--font-jetbrains-mono)",
                  fontSize: 12.5,
                  fontWeight: 600,
                  padding: "8px 14px",
                  borderRadius: 6,
                  border: "1px solid var(--accent)",
                  background: "var(--accent)",
                  color: "oklch(0.17 0.006 60)",
                  whiteSpace: "nowrap",
                  transition: "all 0.12s ease",
                  cursor: "pointer",
                }}
              >
                Read the docs <ArrowIcon />
              </a>
              <a
                href="https://github.com/nublson/quiver"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: 1,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
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
                <GithubIcon /> Star
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
