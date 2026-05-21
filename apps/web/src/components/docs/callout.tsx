interface CalloutProps {
  type?: "note" | "warn" | "tldr";
  children: React.ReactNode;
}

const TYPE_STYLES: Record<
  NonNullable<CalloutProps["type"]>,
  { borderColor: string; tagColor: string; label: string }
> = {
  tldr: {
    borderColor: "var(--accent)",
    tagColor: "var(--accent)",
    label: "tldr",
  },
  note: {
    borderColor: "var(--blue)",
    tagColor: "var(--blue)",
    label: "note",
  },
  warn: {
    borderColor: "var(--red)",
    tagColor: "var(--red)",
    label: "warn",
  },
};

export default function Callout({ type = "tldr", children }: CalloutProps) {
  const s = TYPE_STYLES[type];
  return (
    <div
      style={{
        margin: "20px 0 24px",
        padding: "14px 18px",
        border: "1px solid var(--line)",
        borderLeft: `2px solid ${s.borderColor}`,
        background: "var(--bg-elev)",
        borderRadius: 6,
        fontSize: 14,
        display: "grid",
        gridTemplateColumns: "auto 1fr",
        gap: 14,
        alignItems: "start",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-jetbrains-mono)",
          fontSize: 10.5,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: s.tagColor,
          paddingTop: 2,
          whiteSpace: "nowrap",
        }}
      >
        {s.label}
      </span>
      <div style={{ color: "var(--fg-mute)" }}>{children}</div>
    </div>
  );
}
