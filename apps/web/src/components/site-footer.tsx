const AUTHOR_LINK =
  "rounded-sm transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

export function SiteFooter() {
  return (
    <footer className="flex items-center justify-between py-10 text-sm text-muted-foreground">
      <span>MIT License</span>
      <span>
        by{" "}
        <a href="https://nublson.com" className={AUTHOR_LINK}>
          @nublson
        </a>
      </span>
    </footer>
  );
}
