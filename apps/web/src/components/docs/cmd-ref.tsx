interface CmdRefProps {
  signature: string;
  since: string;
  children: React.ReactNode;
}

export default function CmdRef({ signature, since, children }: CmdRefProps) {
  // Parse signature: "quiver verb [opts]" — accent the verb
  const parts = signature.split(" ");
  const verb = parts[1] ?? "";
  const rest = parts.slice(2).join(" ");

  return (
    <div
      style={{
        margin: "14px 0 26px",
        border: "1px solid var(--line)",
        borderRadius: 8,
        background: "var(--bg-elev)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "14px 18px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          borderBottom: "1px solid var(--line)",
          background: "oklch(0.20 0.006 60)",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-jetbrains-mono)",
            fontSize: 14,
            color: "var(--fg)",
          }}
        >
          {parts[0]}{" "}
          <span style={{ color: "var(--accent)" }}>{verb}</span>
          {rest && (
            <span style={{ color: "var(--fg-dim)" }}> {rest}</span>
          )}
        </span>
        <span
          style={{
            fontFamily: "var(--font-jetbrains-mono)",
            fontSize: 10.5,
            color: "var(--fg-dim)",
            letterSpacing: "0.04em",
            padding: "3px 8px",
            border: "1px solid var(--line)",
            borderRadius: 4,
            whiteSpace: "nowrap",
          }}
        >
          since {since}
        </span>
      </div>
      <div style={{ padding: "16px 18px" }}>{children}</div>
    </div>
  );
}
