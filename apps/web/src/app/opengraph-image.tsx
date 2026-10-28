import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { INSTALL_COMMAND } from "@/lib/site";

export const runtime = "nodejs";
export const alt = "Quiver: Keep your agent skills in sync across every device";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Loaded once per process, not per request.
const inter = readFileSync(join(process.cwd(), "public/fonts/Inter-Regular.ttf"));
const mono = readFileSync(join(process.cwd(), "public/fonts/JetBrainsMono-SemiBold.ttf"));

// The site's light theme (neutral shadcn tokens), in hex for Satori.
const BACKGROUND = "#ffffff";
const FOREGROUND = "#0a0a0a";
const MUTED = "#737373";
const BORDER = "#e5e5e5";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 80,
        background: BACKGROUND,
        color: FOREGROUND,
        fontFamily: "Inter",
      }}
    >
      <div style={{ fontFamily: "JetBrains Mono", fontSize: 36 }}>quiver</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        <div style={{ fontSize: 68, lineHeight: 1.1, letterSpacing: "-0.03em", maxWidth: 900 }}>
          Keep your agent skills in sync across every device.
        </div>
        <div
          style={{
            display: "flex",
            alignSelf: "flex-start",
            padding: "16px 24px",
            border: `2px solid ${BORDER}`,
            borderRadius: 16,
            fontFamily: "JetBrains Mono",
            fontSize: 28,
            color: MUTED,
          }}
        >
          {INSTALL_COMMAND}
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Inter", data: inter, weight: 400 },
        { name: "JetBrains Mono", data: mono, weight: 600 },
      ],
    },
  );
}
