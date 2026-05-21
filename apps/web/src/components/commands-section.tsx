import { SectionLabel } from "@/components/section-label";

const COMMANDS = [
  {
    cmd: ["quiver", "login"],
    title: "AUTHENTICATE",
    desc: "GitHub OAuth device flow. No new account, no new password — just your existing GitHub session.",
  },
  {
    cmd: ["quiver", "push"],
    title: "UPLOAD",
    desc: "Snapshots your global .skill-lock.json to a private Gist. Gist revision history doubles as an audit log.",
  },
  {
    cmd: ["quiver", "sync"],
    title: "INSTALL",
    desc: "Pulls the remote lock and replays missing installs. Additive only — never overwrites local work.",
  },
  {
    cmd: ["quiver", "status"],
    title: "DIFF",
    desc: "Shows what differs between this device and the source of truth before you commit to anything.",
  },
  {
    cmd: ["quiver", "remove", "<skill>"],
    title: "CLEAN REMOVE",
    desc: "Deletes the skill, fixes the lock file (npx skills leaves stale entries), and pushes the update.",
  },
  {
    cmd: ["quiver", "whoami"],
    title: "IDENTIFY",
    desc: "Prints the authenticated GitHub user, gist ID, device name and last sync timestamp.",
  },
];

export default function CommandsSection() {
  return (
    <section id="commands" style={{ padding: "96px 0", position: "relative" }}>
      <div className="container-site">
        <SectionLabel>01 / Surface</SectionLabel>

        <h2
          style={{
            fontFamily: "var(--font-jetbrains-mono)",
            fontSize: "clamp(28px, 3.4vw, 42px)",
            letterSpacing: "-0.025em",
            fontWeight: 600,
            marginBottom: 18,
            maxWidth: "22ch",
            textWrap: "balance",
          }}
        >
          Six commands. Zero ceremony.
        </h2>

        <p
          style={{
            fontSize: 17,
            color: "var(--fg-mute)",
            maxWidth: "60ch",
            marginBottom: 56,
            textWrap: "pretty",
          }}
        >
          Quiver does one thing — keep your global skills consistent across
          machines — and exposes the minimum surface to do it.
        </p>

        <div
          className="cmd-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 1,
            background: "var(--line)",
            border: "1px solid var(--line)",
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          {COMMANDS.map((c, i) => (
            <div
              key={i}
              className="cmd-cell"
              style={{
                padding: 28,
                display: "flex",
                flexDirection: "column",
                gap: 12,
                position: "relative",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: 16,
                  right: 18,
                  fontFamily: "var(--font-jetbrains-mono)",
                  fontSize: 10.5,
                  color: "var(--fg-dim)",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              <div
                style={{
                  fontFamily: "var(--font-jetbrains-mono)",
                  fontSize: 14,
                  color: "var(--fg)",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span style={{ color: "var(--accent)" }}>$</span>
                <span style={{ fontWeight: 500 }}>{c.cmd[0]}</span>
                <span style={{ color: "var(--accent)", fontWeight: 500 }}>{c.cmd[1]}</span>
                {c.cmd[2] && <span style={{ color: "var(--fg-dim)" }}>{c.cmd[2]}</span>}
              </div>

              <h3
                style={{
                  fontFamily: "var(--font-jetbrains-mono)",
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  color: "var(--fg-mute)",
                }}
              >
                {c.title}
              </h3>

              <p style={{ fontSize: 14.5, color: "var(--fg-mute)", lineHeight: 1.5 }}>{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
