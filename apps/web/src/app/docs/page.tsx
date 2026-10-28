import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { getDocs } from "@/lib/docs";
import { GITHUB_URL, TEXT_LINK } from "@/lib/site";

export const revalidate = 3600;

/** /docs opens the first doc. */
export default async function DocsIndex() {
  const [first] = await getDocs();
  if (first) redirect(`/docs/${first.slug}`);
  console.warn(
    "[docs] No published docs. Check NOTION_TOKEN, NOTION_DOCS_DATA_SOURCE_ID and each doc's Published checkbox.",
  );
  return (
    <div className="mx-auto max-w-3xl px-4">
      <SiteHeader />
      <main id="main" className="py-16">
        <h1 className="text-3xl font-semibold tracking-tight">Docs</h1>
        <p className="mt-2 text-muted-foreground">
          No docs published yet. Until they are, the{" "}
          <a href={`${GITHUB_URL}#readme`} className={TEXT_LINK}>
            README on GitHub
          </a>{" "}
          covers installing and using Quiver.
        </p>
      </main>
    </div>
  );
}
