// Segment-level OG image for /docs.
// Next.js opengraph-image metadata is segment-scoped and doesn't cascade to
// child routes, so /docs needs its own file. Config exports must be declared
// inline (Turbopack can't statically resolve re-exported route config).
import Image from "../opengraph-image";

export const runtime = "nodejs";
export const alt = "Quiver — Sync AI agent skills across every machine";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default Image;
