import { defineConfig, defineDocs } from "fumadocs-mdx/config";

export const docs = defineDocs({
  dir: "content/docs",
});

export default defineConfig({
  mdxOptions: {
    rehypeCodeOptions: {
      // Single vesper theme for both modes (dark-only site).
      // Using `themes` key (not `theme`) so it overrides fumadocs'
      // default { themes: { light: 'github-light', dark: 'github-dark' } }.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      themes: { light: "vesper", dark: "vesper" } as any,
      defaultColor: "dark" as unknown as false,
    },
  },
});
