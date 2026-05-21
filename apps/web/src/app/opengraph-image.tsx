import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

export const runtime = "nodejs";
export const alt = "Quiver — Sync AI agent skills across every machine";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// server-hoist-static-io: load fonts at module level so Node.js caches them across invocations
const jbMonoRegular = readFileSync(
  join(process.cwd(), "public/fonts/JetBrainsMono-Regular.ttf")
);
const jbMonoSemiBold = readFileSync(
  join(process.cwd(), "public/fonts/JetBrainsMono-SemiBold.ttf")
);
const interRegular = readFileSync(
  join(process.cwd(), "public/fonts/Inter-Regular.ttf")
);

// Design tokens — oklch values converted to hex for Satori compatibility
const C = {
  bg: "#110f0d",
  bgElev: "#181513",
  line: "#2b2826",
  lineStrong: "#403c3a",
  fg: "#edebe7",
  fgMute: "#a7a4a1",
  fgDim: "#6b6865",
  accent: "#eba941",
  green: "#75d78d",
  blue: "#67b5e1",
  magenta: "#dc89d5",
  termBg: "#090705",
  termChrome: "#161311",
  dots: "#353230",
};

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: C.bg,
          position: "relative",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Corner glow */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 88% 12%, rgba(235,169,65,0.18), transparent 42%)",
            display: "flex",
          }}
        />

        {/* Top brand bar */}
        <div
          style={{
            position: "absolute",
            top: 36,
            left: 72,
            right: 72,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontFamily: '"JetBrains Mono"',
            fontSize: 14,
            color: C.fgDim,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                fontFamily: '"JetBrains Mono"',
                fontSize: 16,
                fontWeight: 600,
                letterSpacing: "-0.02em",
                color: C.fg,
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <span style={{ color: C.fgDim, fontWeight: 400 }}>~/</span>
              <span>quiver</span>
            </div>
            <div
              style={{
                fontFamily: '"JetBrains Mono"',
                fontSize: 11,
                letterSpacing: "0.04em",
                color: C.fgDim,
                padding: "4px 10px",
                border: `1px solid ${C.line}`,
                borderRadius: 999,
                display: "flex",
              }}
            >
              v0.2.3 · open source
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ color: C.accent }}>→</span>
            <span style={{ color: C.fgMute }}>quiver.nublson.com</span>
          </div>
        </div>

        {/* Main two-column layout */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 56,
            padding: "100px 72px 72px",
            flex: 1,
            position: "relative",
          }}
        >
          {/* Left column */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              paddingTop: 28,
            }}
          >
            {/* Eyebrow */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontFamily: '"JetBrains Mono"',
                fontSize: 12,
                letterSpacing: "0.06em",
                color: C.accent,
                textTransform: "uppercase",
                marginBottom: 24,
              }}
            >
              <div
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: 999,
                  background: C.green,
                }}
              />
              <span>CLI · agent-agnostic</span>
            </div>

            {/* Headline */}
            <div
              style={{
                fontFamily: '"JetBrains Mono"',
                fontSize: 58,
                lineHeight: 1.05,
                fontWeight: 600,
                letterSpacing: "-0.035em",
                color: C.fg,
                marginBottom: 24,
                display: "flex",
                flexWrap: "wrap",
                gap: "0 12px",
              }}
            >
              <span>Sync agent skills</span>
              <span style={{ color: C.accent }}>everywhere</span>
              <span>you code.</span>
            </div>

            {/* Lead */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                fontFamily: '"Inter"',
                fontSize: 18,
                lineHeight: 1.45,
                color: C.fgMute,
                marginBottom: 32,
              }}
            >
              <span>One push from your laptop.&nbsp;</span>
              <span style={{ color: C.fg }}>quiver sync</span>
              <span>&nbsp;on every other machine — GitHub-native, zero config.</span>
            </div>

            {/* Install pill */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                fontFamily: '"JetBrains Mono"',
                fontSize: 14,
                padding: "13px 18px",
                border: `1px solid ${C.lineStrong}`,
                background: C.bgElev,
                borderRadius: 8,
                color: C.fg,
                alignSelf: "flex-start",
              }}
            >
              <span style={{ color: C.accent }}>$</span>
              <span>npm install -g usequiver</span>
              <div
                style={{
                  width: 8,
                  height: 16,
                  background: C.accent,
                  marginLeft: 2,
                }}
              />
            </div>
          </div>

          {/* Right column — terminal */}
          <div
            style={{
              width: 464,
              flexShrink: 0,
              display: "flex",
              alignSelf: "stretch",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: "100%",
                background: C.termBg,
                border: `1px solid ${C.line}`,
                borderRadius: 12,
                overflow: "hidden",
                fontFamily: '"JetBrains Mono"',
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Chrome bar */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  height: 36,
                  padding: "0 14px",
                  background: C.termChrome,
                  borderBottom: `1px solid ${C.line}`,
                }}
              >
                <div style={{ display: "flex", gap: 7 }}>
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      style={{
                        width: 11,
                        height: 11,
                        borderRadius: 999,
                        background: C.dots,
                      }}
                    />
                  ))}
                </div>
                <div
                  style={{
                    fontSize: 11.5,
                    color: C.fgDim,
                    letterSpacing: "0.02em",
                  }}
                >
                  workstation · ~/skills
                </div>
                <div style={{ width: 48 }} />
              </div>

              {/* Terminal body */}
              <div
                style={{
                  padding: "18px 20px 20px",
                  fontSize: 13,
                  lineHeight: 1.7,
                  color: C.fg,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div style={{ display: "flex" }}>
                  <span style={{ color: C.fgDim }}>$&nbsp;</span>
                  <span>quiver push</span>
                  <span style={{ color: C.accent }}>&nbsp;--all</span>
                </div>
                <div style={{ display: "flex", paddingLeft: 14 }}>
                  <span style={{ color: C.green }}>+&nbsp;</span>
                  <span style={{ color: C.fgDim }}>code-review.md</span>
                </div>
                <div style={{ display: "flex", paddingLeft: 14 }}>
                  <span style={{ color: C.green }}>+&nbsp;</span>
                  <span style={{ color: C.fgDim }}>pr-summary.md</span>
                </div>
                <div style={{ display: "flex", paddingLeft: 14 }}>
                  <span style={{ color: C.green }}>+&nbsp;</span>
                  <span style={{ color: C.fgDim }}>test-plan.md</span>
                </div>
                <div style={{ display: "flex" }}>
                  <span style={{ color: C.green }}>✓&nbsp;</span>
                  <span style={{ color: C.fgDim }}>3 skills pushed to&nbsp;</span>
                  <span style={{ color: C.magenta }}>origin/main</span>
                </div>
                <div style={{ height: 6 }} />
                <div style={{ display: "flex" }}>
                  <span style={{ color: C.fgDim }}>laptop $&nbsp;</span>
                  <span>quiver sync</span>
                </div>
                <div style={{ display: "flex", paddingLeft: 14 }}>
                  <span style={{ color: C.green }}>✓&nbsp;</span>
                  <span style={{ color: C.fgDim }}>claude-code&nbsp;·&nbsp;3 skills</span>
                </div>
                <div style={{ display: "flex", paddingLeft: 14 }}>
                  <span style={{ color: C.green }}>✓&nbsp;</span>
                  <span style={{ color: C.fgDim }}>cursor&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;·&nbsp;3 skills</span>
                </div>
                <div style={{ display: "flex", paddingLeft: 14 }}>
                  <span style={{ color: C.green }}>✓&nbsp;</span>
                  <span style={{ color: C.fgDim }}>codex&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;·&nbsp;3 skills</span>
                </div>
                <div style={{ display: "flex" }}>
                  <span style={{ color: C.green }}>✓&nbsp;</span>
                  <span style={{ color: C.fgDim }}>in sync · 142ms</span>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span style={{ color: C.fgDim }}>$</span>
                  <div
                    style={{
                      width: 8,
                      height: 14,
                      background: C.accent,
                      marginLeft: 4,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom strip */}
        <div
          style={{
            position: "absolute",
            left: 72,
            right: 72,
            bottom: 36,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontFamily: '"JetBrains Mono"',
            fontSize: 12,
            color: C.fgDim,
          }}
        >
          <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            {(
              [
                { label: "claude code", color: C.accent },
                { label: "cursor", color: C.blue },
                { label: "codex", color: C.green },
                { label: "aider", color: C.magenta },
              ] as { label: string; color: string }[]
            ).map(({ label, color }) => (
              <div
                key={label}
                style={{ display: "flex", alignItems: "center", gap: 8 }}
              >
                <div style={{ width: 8, height: 8, background: color }} />
                <span>{label}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <span>MIT</span>
            <div style={{ width: 1, height: 14, background: C.line }} />
            <span>github.com/nublson/quiver</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "JetBrains Mono",
          data: jbMonoRegular,
          weight: 400,
          style: "normal",
        },
        {
          name: "JetBrains Mono",
          data: jbMonoSemiBold,
          weight: 600,
          style: "normal",
        },
        {
          name: "Inter",
          data: interRegular,
          weight: 400,
          style: "normal",
        },
      ],
    }
  );
}
