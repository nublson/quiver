import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { GITHUB_URL } from "@/lib/site";

const NAV_LINK =
  "rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

export function SiteHeader() {
  return (
    <header className="flex items-center justify-between py-6 text-sm">
      <a
        href="#main"
        className="sr-only rounded-md border border-border bg-background font-medium focus:not-sr-only focus:px-3 focus:py-2 focus:fixed focus:top-4 focus:left-4 focus:z-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        Skip to content
      </a>
      <Link
        href="/"
        className="-m-1 rounded-sm p-1 font-mono font-semibold tracking-tight focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        quiver
      </Link>
      <nav className="flex items-center gap-3.5 sm:gap-5">
        <Link href="/docs" className={NAV_LINK}>
          Docs
        </Link>
        <Link href="/changelog" className={NAV_LINK}>
          Changelog
        </Link>
        <a href={GITHUB_URL} className={NAV_LINK}>
          GitHub
        </a>
        <ThemeToggle />
      </nav>
    </header>
  );
}
