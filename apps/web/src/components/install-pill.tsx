"use client";

import { useState } from "react";

interface InstallPillProps {
  cmd?: string;
}

export default function InstallPill({
  cmd = "npm install -g usequiver",
}: InstallPillProps) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(cmd).catch(() => {});
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  }

  return (
    <div
      className="install-pill"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        maxWidth: 360,
        minWidth: 320,
        fontFamily: "var(--font-jetbrains-mono)",
        fontSize: 13,
        padding: "9px 8px 9px 14px",
        border: "1px solid var(--line-strong)",
        background: "var(--bg-elev)",
        borderRadius: 8,
        color: "var(--fg)",
      }}
    >
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          minWidth: 0,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        <span style={{ color: "var(--accent)" }}>$</span>
        <span>{cmd}</span>
      </span>
      <button
        onClick={handleCopy}
        style={{
          fontFamily: "var(--font-jetbrains-mono)",
          fontSize: 11,
          padding: "4px 10px",
          border: `1px solid ${copied ? "var(--green)" : "var(--line)"}`,
          background: "var(--bg-soft)",
          color: copied ? "var(--green)" : "var(--fg-mute)",
          borderRadius: 5,
          cursor: "pointer",
          transition: "all 0.12s ease",
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}
      >
        {copied ? "✓ copied" : "copy"}
      </button>
    </div>
  );
}
