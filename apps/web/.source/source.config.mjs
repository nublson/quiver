// source.config.ts
import { defineConfig, defineDocs } from "fumadocs-mdx/config";
var docs = defineDocs({
  dir: "content/docs"
});
var source_config_default = defineConfig({
  mdxOptions: {
    rehypeCodeOptions: {
      // Single vesper theme for both modes (dark-only site).
      // Using `themes` key (not `theme`) so it overrides fumadocs'
      // default { themes: { light: 'github-light', dark: 'github-dark' } }.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      themes: { light: "vesper", dark: "vesper" },
      defaultColor: "dark"
    }
  }
});
export {
  source_config_default as default,
  docs
};
