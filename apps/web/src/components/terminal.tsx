"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TokenPart {
  t: string;
  c?: string;
}

interface TermLine {
  type: "prompt" | "output";
  isCommand?: boolean;
  cls?: string;
  parts: TokenPart[];
}

interface Scene {
  label: string;
  host: string;
  path: string;
  lines: TermLine[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function renderTokens(parts: TokenPart[]) {
  return parts.map((p, i) =>
    p.c ? (
      <span key={i} className={p.c}>
        {p.t}
      </span>
    ) : (
      <span key={i}>{p.t}</span>
    )
  );
}

function lineLength(line: TermLine) {
  return line.parts.reduce((n, p) => n + p.t.length, 0);
}

function sliceLine(line: TermLine, chars: number): TermLine {
  const out: TermLine = { ...line, parts: [] };
  let remain = chars;
  for (const p of line.parts) {
    if (remain <= 0) break;
    if (p.t.length <= remain) {
      out.parts.push(p);
      remain -= p.t.length;
    } else {
      out.parts.push({ ...p, t: p.t.slice(0, remain) });
      remain = 0;
    }
  }
  return out;
}

// ─── Scene data ───────────────────────────────────────────────────────────────

const prompt = (host: string, path: string): TokenPart[] => [
  { t: "➜  ", c: "term-prompt" },
  { t: host, c: "term-host" },
  { t: " " },
  { t: path, c: "term-path" },
  { t: " " },
];

function cmdLine(host: string, path: string, parts: TokenPart[]): TermLine {
  return {
    type: "prompt",
    isCommand: true,
    parts: [...prompt(host, path), ...parts],
  };
}

function out(parts: TokenPart[], cls?: string): TermLine {
  return { type: "output", cls, parts };
}

function blank(): TermLine {
  return { type: "output", parts: [{ t: "" }] };
}

const SCENES: Record<string, Scene> = {
  sync: {
    label: "new device",
    host: "macbook-air",
    path: "~",
    lines: [
      cmdLine("macbook-air", "~", [
        { t: "npm install -g ", c: "term-cmd" },
        { t: "usequiver", c: "term-warn" },
      ]),
      out([{ t: "added 1 package in 2.1s", c: "term-mute" }]),
      blank(),
      cmdLine("macbook-air", "~", [
        { t: "quiver ", c: "term-cmd" },
        { t: "login", c: "term-warn" },
      ]),
      out([{ t: "→ Visit ", c: "term-mute" }, { t: "https://github.com/login/device", c: "term-str" }]),
      out([{ t: "→ Code: ", c: "term-mute" }, { t: "A7F4-92QK", c: "term-warn" }]),
      out([{ t: "✓ Authenticated as ", c: "term-ok" }, { t: "@nublson", c: "term-str" }]),
      blank(),
      cmdLine("macbook-air", "~", [
        { t: "quiver ", c: "term-cmd" },
        { t: "sync", c: "term-warn" },
      ]),
      out([{ t: "↓ fetching remote lock from gist…", c: "term-mute" }]),
      out([{ t: "  found 6 skills, 6 missing locally", c: "term-mute" }]),
      blank(),
      out([{ t: "  + ", c: "diff-add" }, { t: "frontend-design", c: "term-cmd" }, { t: "   anthropics/skills", c: "term-mute" }]),
      out([{ t: "  + ", c: "diff-add" }, { t: "react-best-practices", c: "term-cmd" }, { t: "   vercel-labs/agent-skills", c: "term-mute" }]),
      out([{ t: "  + ", c: "diff-add" }, { t: "pdf-reading", c: "term-cmd" }, { t: "        anthropics/skills", c: "term-mute" }]),
      out([{ t: "  + ", c: "diff-add" }, { t: "pptx-export", c: "term-cmd" }, { t: "        anthropics/skills", c: "term-mute" }]),
      out([{ t: "  + ", c: "diff-add" }, { t: "docx-export", c: "term-cmd" }, { t: "        anthropics/skills", c: "term-mute" }]),
      out([{ t: "  + ", c: "diff-add" }, { t: "tailwind-v4", c: "term-cmd" }, { t: "        shadcn/skills", c: "term-mute" }]),
      blank(),
      out([{ t: "✓ installed 6 skills in 4.3s", c: "term-ok" }]),
      out([{ t: "✓ ", c: "term-ok" }, { t: "in sync with ", c: "term-mute" }, { t: "work-imac", c: "term-host" }, { t: " · ", c: "term-mute" }, { t: "thinkpad-x1", c: "term-host" }]),
    ],
  },

  push: {
    label: "work machine",
    host: "work-imac",
    path: "~/projects",
    lines: [
      cmdLine("work-imac", "~/projects", [
        { t: "npx skills add ", c: "term-cmd" },
        { t: "anthropics/skills", c: "term-str" },
        { t: " --skill ", c: "term-flag" },
        { t: "frontend-design", c: "term-str" },
        { t: " -g", c: "term-flag" },
      ]),
      out([{ t: "✓ installed ", c: "term-ok" }, { t: "frontend-design", c: "term-cmd" }, { t: " globally", c: "term-mute" }]),
      blank(),
      cmdLine("work-imac", "~/projects", [
        { t: "quiver ", c: "term-cmd" },
        { t: "push", c: "term-warn" },
      ]),
      out([{ t: "↑ reading ", c: "term-mute" }, { t: "~/.agents/.skill-lock.json", c: "term-str" }]),
      out([{ t: "  6 skills · ", c: "term-mute" }, { t: "+1 since last push", c: "diff-add" }]),
      blank(),
      out([{ t: "↑ uploading to gist ", c: "term-mute" }, { t: "quiver-skill-lock.json", c: "term-str" }]),
      out([{ t: "✓ pushed in 0.7s · revision ", c: "term-ok" }, { t: "#23", c: "term-warn" }]),
      blank(),
      out([{ t: "  your other devices will pick this up on next ", c: "term-mute" }, { t: "quiver sync", c: "term-cmd" }]),
    ],
  },

  status: {
    label: "check diff",
    host: "thinkpad-x1",
    path: "~",
    lines: [
      cmdLine("thinkpad-x1", "~", [
        { t: "quiver ", c: "term-cmd" },
        { t: "status", c: "term-warn" },
      ]),
      blank(),
      out([{ t: "comparing local ↔ remote ", c: "term-mute" }, { t: "(gist · @nublson)", c: "term-str" }]),
      blank(),
      out([{ t: "  remote only  ", c: "term-mute" }, { t: "→", c: "diff-add" }, { t: " 2", c: "term-cmd" }], "term-indent"),
      out([{ t: "    + ", c: "diff-add" }, { t: "tailwind-v4", c: "term-cmd" }, { t: "       shadcn/skills", c: "term-mute" }]),
      out([{ t: "    + ", c: "diff-add" }, { t: "pptx-export", c: "term-cmd" }, { t: "       anthropics/skills", c: "term-mute" }]),
      blank(),
      out([{ t: "  local only   ", c: "term-mute" }, { t: "→", c: "diff-rm" }, { t: " 0", c: "term-cmd" }]),
      out([{ t: "  in sync      ", c: "term-mute" }, { t: "→", c: "diff-eq" }, { t: " 4", c: "term-cmd" }]),
      blank(),
      out([{ t: "  run ", c: "term-mute" }, { t: "quiver sync", c: "term-warn" }, { t: " to install missing skills.", c: "term-mute" }]),
    ],
  },
};

const SCENE_ORDER = ["sync", "push", "status"];

const CMD_CPS = 38;
const OUT_CPS = 280;
const POST_CMD_PAUSE = 380;
const LINE_PAUSE = 90;
const SCENE_END_PAUSE = 2200;

// ─── Terminal component ───────────────────────────────────────────────────────

interface TerminalProps {
  chrome?: "classic" | "minimal";
  autoLoop?: boolean;
}

export default function Terminal({ chrome = "minimal", autoLoop = true }: TerminalProps) {
  const [sceneIdx, setSceneIdx] = useState(0);
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [done, setDone] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const sceneKey = SCENE_ORDER[sceneIdx];
  const scene = SCENES[sceneKey];

  const reset = useCallback((idx: number) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setSceneIdx(idx);
    setLineIdx(0);
    setCharIdx(0);
    setDone(false);
  }, []);

  useEffect(() => {
    if (done) {
      if (autoLoop) {
        timerRef.current = setTimeout(() => {
          reset((sceneIdx + 1) % SCENE_ORDER.length);
        }, SCENE_END_PAUSE);
      }
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }

    const line = scene.lines[lineIdx];
    if (!line) {
      setDone(true);
      return;
    }

    const fullLen = lineLength(line);

    let startChar = 0;
    if (line.isCommand) {
      let promptLen = 0;
      for (let i = 0; i < 5 && i < line.parts.length; i++) {
        promptLen += line.parts[i].t.length;
      }
      startChar = promptLen;
    }

    if (charIdx < startChar) {
      setCharIdx(startChar);
      return;
    }

    if (charIdx >= fullLen) {
      const pause = line.isCommand ? POST_CMD_PAUSE : LINE_PAUSE;
      timerRef.current = setTimeout(() => {
        setLineIdx(lineIdx + 1);
        setCharIdx(0);
      }, pause);
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }

    const isCmd = line.isCommand;
    const cps = isCmd ? CMD_CPS : OUT_CPS;
    const baseDelay = 1000 / cps;
    const jitter = isCmd ? Math.random() * 40 : 0;
    const delay = baseDelay + jitter;
    const step = isCmd ? 1 : Math.max(1, Math.round(OUT_CPS / 50));

    timerRef.current = setTimeout(() => {
      setCharIdx((c) => Math.min(fullLen, c + step));
    }, delay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [sceneIdx, lineIdx, charIdx, done, scene, autoLoop, reset]);

  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lineIdx, charIdx, sceneIdx]);

  const visibleLines: { line: TermLine; chars: number; key: number; isCurrent: boolean }[] = [];
  for (let i = 0; i < lineIdx; i++) {
    visibleLines.push({ line: scene.lines[i], chars: lineLength(scene.lines[i]), key: i, isCurrent: false });
  }
  if (lineIdx < scene.lines.length) {
    visibleLines.push({ line: scene.lines[lineIdx], chars: charIdx, key: lineIdx, isCurrent: true });
  }

  return (
    <div
      role="presentation"
      style={{
        background: "oklch(0.13 0.006 60)",
        border: "1px solid var(--line)",
        borderRadius: 10,
        boxShadow: "0 1px 0 oklch(0.30 0.006 60) inset, 0 24px 60px -20px oklch(0 0 0 / 0.6), 0 4px 16px oklch(0 0 0 / 0.3)",
        overflow: "hidden",
        fontFamily: "var(--font-jetbrains-mono)",
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
          background: chrome === "minimal" ? "transparent" : "oklch(0.19 0.006 60)",
          borderBottom: "1px solid var(--line)",
        }}
      >
        {chrome === "classic" && (
          <div style={{ display: "flex", gap: 7 }}>
            <span style={{ width: 11, height: 11, borderRadius: 999, background: "oklch(0.65 0.18 25)", display: "block" }} />
            <span style={{ width: 11, height: 11, borderRadius: 999, background: "oklch(0.78 0.16 85)", display: "block" }} />
            <span style={{ width: 11, height: 11, borderRadius: 999, background: "oklch(0.72 0.16 150)", display: "block" }} />
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", fontFamily: "var(--font-jetbrains-mono)", fontSize: 11.5, minWidth: 0, flex: 1 }}>
          {SCENE_ORDER.map((k, i) => (
            <span
              key={k}
              onClick={() => reset(i)}
              title={SCENES[k].host}
              style={{
                padding: "6px 14px 5px",
                color: i === sceneIdx ? "var(--fg)" : "var(--fg-dim)",
                borderBottom: `1.5px solid ${i === sceneIdx ? "var(--accent)" : "transparent"}`,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                minWidth: 0,
                flex: 1,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 999,
                  background: i === sceneIdx ? "var(--accent)" : "var(--fg-dim)",
                  display: "inline-block",
                  flexShrink: 0,
                }}
              />
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {SCENES[k].host}
              </span>
            </span>
          ))}
        </div>

        <div style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 11.5, color: "var(--fg-dim)" }}>
          {chrome !== "minimal" ? "zsh — quiver" : ""}
        </div>
      </div>

      {/* Body */}
      <div
        ref={bodyRef}
        style={{
          padding: "18px 20px 22px",
          fontSize: 13.5,
          lineHeight: 1.65,
          color: "var(--fg)",
          minHeight: 380,
          maxHeight: 460,
          overflow: "auto",
          position: "relative",
          fontVariantLigatures: "contextual",
        }}
      >
        {visibleLines.map(({ line, chars, key, isCurrent }) => {
          const truncated = sliceLine(line, chars);
          return (
            <div
              key={key}
              style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", paddingLeft: line.cls === "term-indent" ? 16 : 0 }}
            >
              {renderTokens(truncated.parts)}
              {isCurrent && <span className="term-cursor" />}
            </div>
          );
        })}

        {done && (
          <>
            <div style={{ height: 8 }} />
            <div style={{ whiteSpace: "pre-wrap" }}>
              <span className="term-prompt">➜  </span>
              <span className="term-host">{scene.host}</span>{" "}
              <span className="term-path">{scene.path}</span>{" "}
              <span className="term-cursor" />
            </div>
          </>
        )}

        <button
          onClick={() => reset(sceneIdx)}
          style={{
            position: "absolute",
            right: 14,
            top: 14,
            fontFamily: "var(--font-jetbrains-mono)",
            fontSize: 10.5,
            letterSpacing: "0.04em",
            color: "var(--fg-dim)",
            padding: "4px 8px",
            border: "1px solid var(--line)",
            background: "oklch(0.17 0.006 60 / 0.6)",
            borderRadius: 5,
            cursor: "pointer",
            textTransform: "uppercase",
            transition: "all 0.12s ease",
          }}
        >
          ↻ replay
        </button>
      </div>
    </div>
  );
}
