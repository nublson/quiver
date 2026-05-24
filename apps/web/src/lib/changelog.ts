import type { CSSProperties, ReactNode } from "react";

export type EntryType = "add" | "chg" | "fix" | "rm";

export interface Entry {
  type: EntryType;
  text: ReactNode;
}

export interface Section {
  type: EntryType;
  label: string;
  entries: Entry[];
}

export interface Release {
  id: string;
  version: string;
  tag?: "latest" | "major" | "initial";
  sha: string;
  date: string;
  bumpLabel: string;
  summary: ReactNode;
  sections: Section[];
  stats: { add?: number; chg?: number; fix?: number; rm?: number };
}

export const GLYPH: Record<EntryType, string> = {
  add: "+",
  chg: "~",
  fix: "✓",
  rm: "−",
};

export const GLYPH_COLOR: Record<EntryType, string> = {
  add: "var(--green)",
  chg: "var(--accent)",
  fix: "var(--blue)",
  rm: "var(--red)",
};

export const SEP_COLOR: Record<EntryType, string> = {
  add: "oklch(0.80 0.14 150 / 0.7)",
  chg: "oklch(0.78 0.14 75 / 0.7)",
  fix: "oklch(0.74 0.10 235 / 0.7)",
  rm: "oklch(0.72 0.16 25 / 0.7)",
};

export const TAG_STYLE: Record<
  string,
  { color: string; borderColor: string; background: string }
> = {
  latest: {
    color: "var(--accent)",
    borderColor: "var(--accent)",
    background: "var(--accent-dim)",
  },
  major: {
    color: "var(--blue)",
    borderColor: "oklch(0.74 0.10 235 / 0.5)",
    background: "oklch(0.74 0.10 235 / 0.12)",
  },
  initial: {
    color: "var(--blue)",
    borderColor: "oklch(0.74 0.10 235 / 0.5)",
    background: "oklch(0.74 0.10 235 / 0.12)",
  },
};

export const entryCodeStyle: CSSProperties = {
  fontFamily: "var(--font-jetbrains-mono)",
  fontSize: "0.88em",
  background: "var(--bg-elev)",
  border: "1px solid var(--line)",
  color: "var(--accent)",
  padding: "1px 6px",
  borderRadius: 4,
};
