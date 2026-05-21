import { source } from "@/lib/source";
import DocsSidebar from "./sidebar";
import "./docs.css";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="docs-shell">
      <DocsSidebar tree={source.pageTree} />
      {children}
    </div>
  );
}
