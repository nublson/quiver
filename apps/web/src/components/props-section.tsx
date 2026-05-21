import { SectionLabel } from "@/components/section-label";

const PROPS = [
  {
    glyph: "01",
    h: "Zero-friction sync",
    p: "One command on a fresh machine restores every global skill you had elsewhere. No dotfile copy-paste, no manual reinstall.",
  },
  {
    glyph: "02",
    h: "GitHub-native",
    p: "Auth is GitHub OAuth. Storage is a private Gist on your own account. Nothing new to trust, no new account to remember.",
  },
  {
    glyph: "03",
    h: "Agent-agnostic",
    p: "Works with Claude Code, Cursor, Gemini CLI, Copilot — anything that uses the global skill lock at ~/.agents/.skill-lock.json.",
  },
  {
    glyph: "04",
    h: "Non-destructive",
    p: "Sync is additive only. Local skills are never removed or overwritten. Conflict resolution stays your call.",
  },
  {
    glyph: "05",
    h: "No proprietary backend",
    p: "There is no Quiver server holding your skill data. Gist is the source of truth; the CLI talks to it directly.",
  },
  {
    glyph: "06",
    h: "Open source · MIT",
    p: "Read the code, run it yourself, fork it. Released under MIT — no shady terms hidden behind a free tier.",
  },
];

export default function PropsSection() {
  return (
    <section id="why" style={{ padding: "96px 0 0", position: "relative" }}>
      <div className="container-site">
        <SectionLabel>03 / Why</SectionLabel>

        <h2
          style={{
            fontFamily: "var(--font-jetbrains-mono)",
            fontSize: "clamp(28px, 3.4vw, 42px)",
            letterSpacing: "-0.025em",
            fontWeight: 600,
            marginBottom: 56,
            maxWidth: "22ch",
            textWrap: "balance",
          }}
        >
          Built the way devs already work.
        </h2>
      </div>

      <div
        className="props-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 1,
          background: "var(--line)",
          borderTop: "1px solid var(--line)",
          borderBottom: "1px solid var(--line)",
        }}
      >
        {PROPS.map((p, i) => (
          <div key={i} style={{ background: "var(--bg)", padding: "32px 28px" }}>
            <div
              style={{
                fontFamily: "var(--font-jetbrains-mono)",
                fontSize: 11,
                letterSpacing: "0.1em",
                color: "var(--accent)",
                marginBottom: 18,
              }}
            >
              {p.glyph}
            </div>
            <h4
              style={{
                fontFamily: "var(--font-jetbrains-mono)",
                fontSize: 16,
                fontWeight: 600,
                letterSpacing: "-0.01em",
                marginBottom: 8,
              }}
            >
              {p.h}
            </h4>
            <p style={{ fontSize: 14, color: "var(--fg-mute)", lineHeight: 1.55 }}>{p.p}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
