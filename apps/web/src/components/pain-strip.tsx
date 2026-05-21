export default function PainStrip() {
  return (
    <div
      style={{
        borderTop: "1px solid var(--line)",
        borderBottom: "1px solid var(--line)",
        background: "var(--bg-elev)",
        padding: "56px 0",
      }}
    >
      <div
        className="pain-grid"
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "0 32px",
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          gap: 40,
          alignItems: "center",
        }}
      >
        <div style={{ fontFamily: "var(--font-jetbrains-mono)" }}>
          <div
            style={{
              fontSize: 10.5,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--fg-dim)",
              marginBottom: 12,
            }}
          >
            // before
          </div>
          <div style={{ fontSize: 17, lineHeight: 1.5, color: "var(--fg)" }}>
            "I set up all my skills on my work machine and now I&apos;m on my
            personal Mac and nothing is there."
          </div>
        </div>

        <div
          className="pain-arrow"
          style={{
            fontFamily: "var(--font-jetbrains-mono)",
            fontSize: 24,
            color: "var(--accent)",
          }}
        >
          →
        </div>

        <div style={{ fontFamily: "var(--font-jetbrains-mono)" }}>
          <div
            style={{
              fontSize: 10.5,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--fg-dim)",
              marginBottom: 12,
            }}
          >
            // with quiver
          </div>
          <div style={{ fontSize: 17, lineHeight: 1.5, color: "var(--fg)" }}>
            <em style={{ color: "var(--accent)", fontStyle: "normal" }}>quiver sync</em>
            &nbsp;— one command, every skill, every agent, every device.
          </div>
        </div>
      </div>
    </div>
  );
}
