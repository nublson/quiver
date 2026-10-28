import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-svh max-w-3xl flex-col px-4">
      <SiteHeader />
      <main id="main" className="flex flex-1 flex-col items-center py-24 text-center sm:py-32">
        <h1 className="text-4xl font-semibold tracking-tight">This page doesn’t exist</h1>
        <p className="mt-3 max-w-sm text-lg text-pretty text-muted-foreground">
          It may have moved when the docs were reorganized.
        </p>
        <div className="mt-8 flex gap-2">
          <Link href="/docs" className={buttonVariants({ size: "lg", className: "min-w-32" })}>
            Browse the docs
          </Link>
          <Link
            href="/"
            className={buttonVariants({ variant: "outline", size: "lg", className: "min-w-32" })}
          >
            Go home
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
