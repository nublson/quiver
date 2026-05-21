import Footer from "@/components/footer";
import Nav from "@/components/nav";
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Quiver — Keep your AI agent skills in sync across every device",
  description:
    "Quiver is a CLI sync layer for AI agent skills. Push from one machine, run quiver sync on the next. GitHub-native. Agent-agnostic. Open source.",
  metadataBase: new URL("https://quiver.nublson.com"),
  openGraph: {
    title: "Quiver — Keep your AI agent skills in sync across every device",
    description:
      "Quiver is a CLI sync layer for AI agent skills. Push from one machine, run quiver sync on the next. GitHub-native. Agent-agnostic. Open source.",
    url: "https://quiver.nublson.com",
    siteName: "Quiver",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Quiver — Keep your AI agent skills in sync across every device",
    description:
      "Quiver is a CLI sync layer for AI agent skills. Push from one machine, run quiver sync on the next. GitHub-native. Agent-agnostic. Open source.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Nav />
        <main className="flex flex-col flex-1">
          <div className="grid-bg" />
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
