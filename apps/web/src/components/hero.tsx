import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { GITHUB_URL } from "@/lib/site";

/** The landing page hero: the name, one sentence, two actions. */
export function Hero() {
  return (
    <section className="flex flex-col items-center py-24 text-center sm:py-32">
      <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">quiver</h1>
      <p className="mt-3 max-w-sm text-lg text-pretty text-muted-foreground">
        Keep your AI agent skills in sync across every device. Push from one machine, sync on the
        next.
      </p>
      <div className="mt-8 flex gap-2">
        <Link href="/docs" className={buttonVariants({ size: "lg", className: "min-w-32" })}>
          Get started
        </Link>
        <a
          href={GITHUB_URL}
          className={buttonVariants({ variant: "outline", size: "lg", className: "min-w-32" })}
        >
          GitHub
        </a>
      </div>
    </section>
  );
}
