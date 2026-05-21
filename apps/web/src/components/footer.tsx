import Link from "next/link";

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--line)",
        padding: "40px 0 56px",
        fontFamily: "var(--font-jetbrains-mono)",
        fontSize: 12,
        color: "var(--fg-dim)",
      }}
    >
      <div className="container-site">
        <div
          className="foot-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: 40,
            alignItems: "center",
          }}
        >
          <div
            className="foot-brand"
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <span style={{ color: "var(--fg)" }}>
              By{" "}
              <a
                href="https://nublson.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--accent)", borderBottom: "1px solid var(--accent)" }}
              >
                Nubelson
              </a>
            </span>
            <span className="foot-sep" style={{ color: "var(--fg-dim)" }}>·</span>
            <span style={{ color: "var(--fg-dim)" }}>for developers, with love and coffee</span>
          </div>

          <div className="foot-links" style={{ display: "flex", gap: 24 }}>
            <a
              href="https://github.com/nublson/quiver"
              target="_blank"
              rel="noopener noreferrer"
              style={{ transition: "color 0.12s" }}
            >
              github
            </a>
            <a
              href="https://www.npmjs.com/package/usequiver"
              target="_blank"
              rel="noopener noreferrer"
              style={{ transition: "color 0.12s" }}
            >
              npm
            </a>
            <Link href="/docs" style={{ transition: "color 0.12s" }}>docs</Link>
            <a href="#" style={{ transition: "color 0.12s" }}>changelog</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
