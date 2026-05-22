"use client";

import { SectionLabel } from "@/components/section-label";
import { useState } from "react";

const STEPS = [
  {
    h: "You install skills the usual way",
    p: "Use npx skills add <repo> --skill <name> -g. Quiver does not replace your installer — it observes the lock file it produces.",
  },
  {
    h: "quiver push uploads ~/.agents/.skill-lock.json",
    p: "The lock file is written to a secret GitHub Gist named quiver-skill-lock.json. One Gist per user. No database, no proprietary backend.",
  },
  {
    h: "On a new device: quiver sync",
    p: "Quiver fetches the remote lock, groups missing skills by source repo, and installs all groups in parallel with live progress per source. Lock file is reconciled after every group settles. Additive only — your local work is never overwritten.",
  },
  {
    h: "Your skills follow you",
    p: "Work iMac, home laptop, the corporate lender — every machine ends up with the same set of agent skills, ready for Claude Code, Cursor, Gemini, Copilot, or whatever you use next.",
  },
];

type DeviceStatus = "empty" | "installing" | "pushed" | "syncing" | "synced";

interface Device {
  name: string;
  status: DeviceStatus;
  skills: string[];
}

const DEVICE_STATES: Device[][] = [
  [
    {
      name: "work-imac",
      status: "installing",
      skills: ["frontend-design", "pdf-reading", "react-best-practices"],
    },
    { name: "macbook-air", status: "empty", skills: [] },
    { name: "thinkpad-x1", status: "empty", skills: [] },
  ],
  [
    {
      name: "work-imac",
      status: "pushed",
      skills: ["frontend-design", "pdf-reading", "react-best-practices"],
    },
    { name: "macbook-air", status: "empty", skills: [] },
    { name: "thinkpad-x1", status: "empty", skills: [] },
  ],
  [
    {
      name: "work-imac",
      status: "synced",
      skills: ["frontend-design", "pdf-reading", "react-best-practices"],
    },
    {
      name: "macbook-air",
      status: "syncing",
      skills: ["frontend-design", "pdf-reading", "react-best-practices"],
    },
    { name: "thinkpad-x1", status: "empty", skills: [] },
  ],
  [
    {
      name: "work-imac",
      status: "synced",
      skills: ["frontend-design", "pdf-reading", "react-best-practices"],
    },
    {
      name: "macbook-air",
      status: "synced",
      skills: ["frontend-design", "pdf-reading", "react-best-practices"],
    },
    {
      name: "thinkpad-x1",
      status: "synced",
      skills: ["frontend-design", "pdf-reading", "react-best-practices"],
    },
  ],
];

const STATUS_COLORS: Record<DeviceStatus, { fg: string; label: string }> = {
  empty: { fg: "var(--fg-dim)", label: "— empty" },
  installing: { fg: "var(--accent)", label: "installing…" },
  pushed: { fg: "var(--accent)", label: "pushed" },
  syncing: { fg: "var(--blue)", label: "syncing…" },
  synced: { fg: "var(--green)", label: "in sync" },
};

function DeviceTopology({ active }: { active: number }) {
  const devices = DEVICE_STATES[active] ?? DEVICE_STATES[0];

  return (
    <div>
      <div
        style={{
          fontFamily: "var(--font-jetbrains-mono)",
          fontSize: 11.5,
          color: "var(--fg-dim)",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          marginBottom: 14,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>device topology</span>
        <span>
          github gist ·{" "}
          <span style={{ color: "var(--accent)" }}>quiver-skill-lock.json</span>
        </span>
      </div>

      {/* Gist node */}
      <div
        style={{
          border: "1px dashed var(--line-strong)",
          background: "oklch(0.20 0.006 60 / 0.6)",
          borderRadius: 8,
          padding: "12px 16px",
          marginBottom: 16,
          fontFamily: "var(--font-jetbrains-mono)",
          fontSize: 12,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ color: "var(--fg-mute)" }}>
          <span style={{ color: "var(--accent)" }}>◆ </span>
          gist://nublson/quiver-skill-lock.json
        </span>
        <span style={{ color: "var(--fg-dim)" }}>
          {active >= 1
            ? `rev #23 · ${devices[0].skills.length} skills`
            : "rev #22"}
        </span>
      </div>

      {/* Device cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 16,
          marginTop: 40,
        }}
      >
        {devices.map((d) => {
          const c = STATUS_COLORS[d.status];
          return (
            <div
              key={d.name}
              style={{
                border: "1px solid var(--line)",
                background: "var(--bg-elev)",
                borderRadius: 10,
                padding: 18,
                fontFamily: "var(--font-jetbrains-mono)",
                fontSize: 12,
                position: "relative",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 14,
                }}
              >
                <span style={{ color: "var(--fg)", fontWeight: 600 }}>
                  {d.name}
                </span>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 10.5,
                    color: c.fg,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: 999,
                      background: c.fg,
                      display: "inline-block",
                    }}
                  />
                  {c.label}
                </span>
              </div>

              <div style={{ color: "var(--fg-dim)", fontSize: 11 }}>
                ~/.agents/.skill-lock.json
              </div>

              {d.skills.length > 0 ? (
                <ul
                  style={{
                    listStyle: "none",
                    marginTop: 12,
                    display: "flex",
                    flexDirection: "column",
                    gap: 5,
                  }}
                >
                  {d.skills.map((s) => (
                    <li
                      key={s}
                      style={{
                        color: "var(--fg-mute)",
                        fontSize: 11.5,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        opacity: d.status === "syncing" ? 0.65 : 1,
                        transition: "opacity 0.4s ease",
                      }}
                    >
                      <span style={{ color: "var(--accent)", fontSize: 10 }}>
                        ▸
                      </span>
                      {s}
                    </li>
                  ))}
                </ul>
              ) : (
                <div
                  style={{
                    marginTop: 12,
                    padding: 10,
                    border: "1px dashed var(--line)",
                    borderRadius: 6,
                    textAlign: "center",
                    color: "var(--fg-dim)",
                    fontSize: 11,
                  }}
                >
                  no skills installed
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function HowItWorks() {
  const [active, setActive] = useState(0);

  return (
    <section
      id="how"
      style={{
        padding: "96px 0",
        position: "relative",
        background: "var(--bg-elev)",
        borderTop: "1px solid var(--line)",
        borderBottom: "1px solid var(--line)",
      }}
    >
      <div className="container-site">
        <SectionLabel>02 / Flow</SectionLabel>

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
          A sync layer, not another package manager.
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
          Quiver sits between your global skill lock file and a private Gist.
          That&apos;s the entire architecture.
        </p>

        <div
          className="hiw-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.1fr)",
            gap: 64,
            alignItems: "start",
          }}
        >
          {/* Steps accordion */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {STEPS.map((s, i) => (
              <div
                key={i}
                onMouseEnter={() => setActive(i)}
                style={{
                  display: "grid",
                  gridTemplateColumns: "44px 1fr",
                  gap: 18,
                  padding: "20px 0",
                  borderBottom:
                    i < STEPS.length - 1 ? "1px solid var(--line)" : "none",
                  cursor: "pointer",
                  alignItems: "start",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-jetbrains-mono)",
                    fontSize: 12,
                    color: i === active ? "var(--accent)" : "var(--fg-dim)",
                    paddingTop: 4,
                    letterSpacing: "0.05em",
                    transition: "color 0.14s ease",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div>
                  <h4
                    style={{
                      fontFamily: "var(--font-jetbrains-mono)",
                      fontSize: 18,
                      fontWeight: 500,
                      letterSpacing: "-0.01em",
                      color: i === active ? "var(--fg)" : "var(--fg-mute)",
                      marginBottom: 6,
                      transition: "color 0.14s ease",
                    }}
                  >
                    {s.h}
                  </h4>
                  <p
                    style={{
                      fontSize: 14.5,
                      color: "var(--fg-dim)",
                      lineHeight: 1.55,
                      maxHeight: i === active ? 200 : 0,
                      overflow: "hidden",
                      transition: "max-height 0.3s ease, margin 0.3s ease",
                      marginTop: i === active ? 4 : 0,
                    }}
                  >
                    {s.p}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Device topology */}
          <DeviceTopology active={active} />
        </div>
      </div>
    </section>
  );
}
