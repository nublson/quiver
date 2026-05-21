import InstallPill from "@/components/install-pill";
import { SectionLabel } from "@/components/section-label";
import { ArrowIcon, GithubIcon } from "@/components/icons";

export default function CTASection() {
  return (
    <section style={{ padding: "96px 0", position: "relative" }}>
      <div className="container-site">
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
            <SectionLabel>04 / Get it</SectionLabel>

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
              <code style={{ fontFamily: "var(--font-jetbrains-mono)", color: "var(--accent)" }}>
                quiver login
              </code>{" "}
              once, and your global skills follow you to every machine you sign in on.
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
