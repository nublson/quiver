import Link from "next/link";

export default function PageBreadcrumb({ label }: { label: string }) {
  return (
    <nav className="page-breadcrumb" aria-label="breadcrumb">
      <Link href="/">~/</Link>
      <span className="sep">/</span>
      <span className="current">{label}</span>
    </nav>
  );
}
