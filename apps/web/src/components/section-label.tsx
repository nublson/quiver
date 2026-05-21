interface SectionLabelProps {
  children: React.ReactNode;
}

export function SectionLabel({ children }: SectionLabelProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        fontFamily: "var(--font-jetbrains-mono)",
        fontSize: 11.5,
        letterSpacing: "0.08em",
        color: "var(--accent)",
        textTransform: "uppercase" as const,
        marginBottom: 16,
      }}
    >
      <span style={{ width: 16, height: 1, background: "var(--accent)", display: "inline-block" }} />
      {children}
    </div>
  );
}
