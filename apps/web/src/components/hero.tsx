import Terminal from "@/components/terminal";
import InstallPill from "@/components/install-pill";
import { ArrowIcon } from "@/components/icons";
import { CLI_VERSION } from "@/lib/version";

export default function Hero() {
  return (
    <header style={{ padding: "96px 0 64px", position: "relative" }}>
      <div className="container-site">
        <div
          className="hero-grid-side"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.05fr)",
            gap: 48,
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                fontFamily: "var(--font-jetbrains-mono)",
                fontSize: 11.5,
                letterSpacing: "0.02em",
                color: "var(--fg-mute)",
                padding: "5px 12px 5px 8px",
                border: "1px solid var(--line)",
                background: "var(--bg-elev)",
                borderRadius: 999,
                marginBottom: 28,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 999,
                  background: "var(--green)",
                  boxShadow: "0 0 0 3px oklch(0.80 0.14 150 / 0.18)",
                  display: "inline-block",
                }}
              />
              v{CLI_VERSION} · agent-agnostic
            </div>

            <h1
              style={{
                fontFamily: "var(--font-jetbrains-mono)",
                fontSize: "clamp(36px, 3.8vw, 56px)",
                lineHeight: 1.02,
                fontWeight: 600,
                letterSpacing: "-0.035em",
                marginBottom: 24,
                maxWidth: "18ch",
                textWrap: "balance",
              }}
            >
              Keep your AI agent skills{" "}
              <span style={{ color: "var(--accent)" }}>in sync</span> across
              every device.
            </h1>

            <p
              style={{
                fontSize: 18,
                lineHeight: 1.55,
                color: "var(--fg-mute)",
                maxWidth: "56ch",
                marginBottom: 36,
                textWrap: "pretty",
              }}
            >
              Quiver is a CLI sync layer for the global skills your agents
              share. Push from one machine, run{" "}
              <code style={{ fontFamily: "var(--font-jetbrains-mono)", color: "var(--accent)" }}>
                quiver sync
              </code>{" "}
              on the next, and pick up exactly where you left off — no dotfile
              scripts, no new accounts, no proprietary backend.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
              <InstallPill cmd="npm install -g usequiver" />
              <a
                href="#how"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
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
                See how it works <ArrowIcon />
              </a>
            </div>
          </div>

          <div style={{ marginTop: 8, position: "relative", minWidth: 0, overflow: "hidden" }}>
            <Terminal chrome="minimal" autoLoop />
          </div>
        </div>
      </div>
    </header>
  );
}
