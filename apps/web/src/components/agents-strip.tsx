const AGENTS = [
  "Claude Code",
  "Cursor",
  "Gemini CLI",
  "GitHub Copilot",
  "Windsurf",
  "Zed",
  "any agent using skill-lock",
];

export default function AgentsStrip() {
  return (
    <section style={{ paddingTop: 32, paddingBottom: 48, position: "relative" }}>
      <div className="container-site">
        <div
          style={{
            fontFamily: "var(--font-jetbrains-mono)",
            fontSize: 11.5,
            color: "var(--fg-dim)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <span style={{ width: 16, height: 1, background: "var(--line-strong)", display: "inline-block" }} />
          syncs skills for
        </div>

        <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 14, marginTop: 8 }}>
          {AGENTS.map((a, i) => {
            const squareColors = ["var(--accent)", "var(--blue)", "var(--green)", "var(--magenta)"];
            const color = squareColors[i % squareColors.length];
            return (
              <span
                key={a}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 16px",
                  border: "1px solid var(--line)",
                  background: "var(--bg-elev)",
                  borderRadius: 8,
                  fontFamily: "var(--font-jetbrains-mono)",
                  fontSize: 13,
                  color: "var(--fg-mute)",
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    background: color,
                    display: "inline-block",
                    flexShrink: 0,
                  }}
                />
                {a}
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}
