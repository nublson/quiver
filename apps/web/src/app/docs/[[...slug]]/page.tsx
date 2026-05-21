import { source } from "@/lib/source";
import { notFound } from "next/navigation";
import Link from "next/link";
import DocsTOC from "../toc";
import Callout from "@/components/docs/callout";
import CmdRef from "@/components/docs/cmd-ref";
import Terminal from "@/components/docs/terminal";

export default async function DocPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  const page = source.getPage(slug ?? []);
  if (!page) notFound();

  const MDXContent = page.data.body;
  const toc = page.data.toc;

  // Build breadcrumb from URL segments
  const segments = page.url.split("/").filter(Boolean); // ["docs", ...]
  const breadcrumbs: { label: string; href: string }[] = [];
  let accumulated = "";
  for (const seg of segments) {
    accumulated += `/${seg}`;
    breadcrumbs.push({ label: seg, href: accumulated });
  }

  // Pager: prev/next from flat page list
  const allPages = source.getPages();
  const currentIndex = allPages.findIndex((p) => p.url === page.url);
  const prev = currentIndex > 0 ? allPages[currentIndex - 1] : null;
  const next =
    currentIndex < allPages.length - 1 ? allPages[currentIndex + 1] : null;

  return (
    <div className="docs-content-shell">
      <main className="docs-main">
        {/* Header */}
        <div className="docs-header">
          <nav className="docs-breadcrumb" aria-label="breadcrumb">
            <Link href="/">~/</Link>
            {breadcrumbs.map((crumb, i) => (
              <span key={crumb.href} style={{ display: "contents" }}>
                <span className="sep">/</span>
                {i === breadcrumbs.length - 1 ? (
                  <span className="current">{crumb.label}</span>
                ) : (
                  <Link href={crumb.href}>{crumb.label}</Link>
                )}
              </span>
            ))}
          </nav>
          <h1>{page.data.title}</h1>
          {page.data.description && (
            <p className="lede">{page.data.description}</p>
          )}
        </div>

        {/* MDX content */}
        <MDXContent components={{ Callout, CmdRef, Terminal }} />

        {/* Pager */}
        {(prev || next) && (
          <div className="docs-pager">
            {prev ? (
              <Link href={prev.url} className="prev">
                <span className="dir">← prev</span>
                <span className="title">{prev.data.title}</span>
              </Link>
            ) : (
              <div />
            )}
            {next ? (
              <Link href={next.url} className="next">
                <span className="dir">next →</span>
                <span className="title">{next.data.title}</span>
              </Link>
            ) : (
              <div />
            )}
          </div>
        )}
      </main>

      <DocsTOC items={toc} />
    </div>
  );
}

export function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  const page = source.getPage(slug ?? []);
  if (!page) return {};
  return {
    title: `${page.data.title} — Quiver Docs`,
    description: page.data.description,
  };
}
