"use client";

import { useState } from "react";

interface TerminalProps {
  label?: string;
  copy?: string;
  children: React.ReactNode;
}

export default function Terminal({ label, copy, children }: TerminalProps) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    if (!copy) return;
    navigator.clipboard?.writeText(copy).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  }

  return (
    <div
      style={{
        margin: "18px 0 24px",
        border: "1px solid var(--line)",
        borderRadius: 8,
        background: "oklch(0.13 0.006 60)",
        fontFamily: "var(--font-jetbrains-mono)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: 32,
          padding: "0 12px 0 14px",
          background: "oklch(0.19 0.006 60)",
          borderBottom: "1px solid var(--line)",
          fontSize: 11,
          color: "var(--fg-dim)",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}
      >
        <span>{label ?? "terminal"}</span>
        {copy && (
          <button
            onClick={handleCopy}
            style={{
              fontFamily: "var(--font-jetbrains-mono)",
              fontSize: 10.5,
              background: "transparent",
              border: `1px solid ${copied ? "var(--green)" : "var(--line)"}`,
              color: copied ? "var(--green)" : "var(--fg-dim)",
              padding: "3px 8px",
              borderRadius: 4,
              cursor: "pointer",
              letterSpacing: "0.04em",
              transition: "all 0.12s ease",
            }}
          >
            {copied ? "✓ copied" : "copy"}
          </button>
        )}
      </div>
      <pre
        style={{
          margin: 0,
          padding: "14px 18px",
          fontSize: 13,
          lineHeight: 1.6,
          color: "var(--fg)",
          overflowX: "auto",
          whiteSpace: "pre",
        }}
      >
        {children}
      </pre>
    </div>
  );
}
