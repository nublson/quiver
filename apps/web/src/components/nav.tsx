import Link from "next/link";
import { CLI_VERSION } from "@/lib/version";

function GithubIcon() {
  return (
    <svg
      width={14}
      height={14}
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden
    >
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38v-1.33c-2.22.48-2.69-1.07-2.69-1.07-.36-.92-.89-1.17-.89-1.17-.73-.5.05-.49.05-.49.81.06 1.23.83 1.23.83.72 1.23 1.88.87 2.34.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.13 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.11.16 1.93.08 2.13.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.74.54 1.49v2.21c0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

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
      <div
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "0 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 60,
        }}
      >
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
              <span style={{ color: "var(--fg-dim)", fontWeight: 400 }}>
                ~/
              </span>
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
          <a href="#commands" style={{ transition: "color 0.12s" }}>
            commands
          </a>
          <a href="#how" style={{ transition: "color 0.12s" }}>
            how it works
          </a>
          <a href="#why" style={{ transition: "color 0.12s" }}>
            why
          </a>
          <Link href="/docs" style={{ transition: "color 0.12s" }}>
            docs
          </Link>
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
