"use client";

import { useRef, useState } from "react";
import type { HTMLAttributes, ReactNode } from "react";

interface CodeBlockProps {
  title?: string;
  lang?: string;
  children?: ReactNode;
}

export function CodeBlock({ title, lang, children }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const figRef = useRef<HTMLElement>(null);

  function handleCopy() {
    const text = figRef.current?.querySelector("pre")?.textContent ?? "";
    navigator.clipboard?.writeText(text.trim()).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  }

  const label = title ?? lang ?? "terminal";

  return (
    <figure
      ref={figRef}
      style={{
        margin: "18px 0 24px",
        border: "1px solid var(--line)",
        borderRadius: 8,
        background: "oklch(0.13 0.006 60)",
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
          fontFamily: "var(--font-jetbrains-mono)",
          fontSize: 11,
          color: "var(--fg-dim)",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}
      >
        <span>{label}</span>
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
      </div>
      {children}
    </figure>
  );
}

export function Pre({ children, ...props }: HTMLAttributes<HTMLPreElement>) {
  return (
    <pre
      {...props}
      style={{
        margin: 0,
        padding: "14px 18px",
        fontSize: 13,
        lineHeight: 1.6,
        overflowX: "auto",
        background: "transparent",
      }}
    >
      {children}
    </pre>
  );
}
