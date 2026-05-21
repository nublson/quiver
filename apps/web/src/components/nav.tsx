import Link from "next/link";
import { GithubIcon } from "@/components/icons";
import { CLI_VERSION } from "@/lib/version";

export default function Nav() {
  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backdropFilter: "blur(12px) saturate(140%)",
        WebkitBackdropFilter: "blur(12px) saturate(140%)",
        background: "oklch(0.17 0.006 60 / 0.72)",
        borderBottom: "1px solid var(--line)",
      }}
    >
      <div className="container-site" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontFamily: "var(--font-jetbrains-mono)",
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: "-0.02em",
          }}
        >
          <Link href="/">
            <span style={{ color: "var(--fg)" }}>
              <span style={{ color: "var(--fg-dim)", fontWeight: 400 }}>~/</span>
              quiver
            </span>
          </Link>
          <span
            style={{
              fontSize: 10,
              fontFamily: "var(--font-jetbrains-mono)",
              color: "var(--fg-dim)",
              padding: "2px 8px",
              border: "1px solid var(--line)",
              borderRadius: 999,
              marginLeft: 4,
              whiteSpace: "nowrap",
              lineHeight: 1.4,
            }}
          >
            v{CLI_VERSION}
          </span>
        </div>

        <div
          className="nav-links"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            fontFamily: "var(--font-jetbrains-mono)",
            fontSize: 12.5,
            color: "var(--fg-mute)",
          }}
        >
          <a href="#commands" style={{ transition: "color 0.12s" }}>commands</a>
          <a href="#how" style={{ transition: "color 0.12s" }}>how it works</a>
          <a href="#why" style={{ transition: "color 0.12s" }}>why</a>
          <Link href="/docs" style={{ transition: "color 0.12s" }}>docs</Link>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
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
              border: "1px solid transparent",
              background: "transparent",
              color: "var(--fg-mute)",
              whiteSpace: "nowrap",
              transition: "all 0.12s ease",
              cursor: "pointer",
            }}
          >
            <GithubIcon /> github
          </a>
          <a
            href="https://www.npmjs.com/package/usequiver"
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
            npm
          </a>
        </div>
      </div>
    </nav>
  );
}
