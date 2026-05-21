// @ts-nocheck
import { browser } from 'fumadocs-mdx/runtime/browser';
import type * as Config from '../source.config';

const create = browser<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>();
const browserCollections = {
  docs: create.doc("docs", {"authentication.mdx": () => import("../content/docs/authentication.mdx?collection=docs"), "index.mdx": () => import("../content/docs/index.mdx?collection=docs"), "install.mdx": () => import("../content/docs/install.mdx?collection=docs"), "quick-start.mdx": () => import("../content/docs/quick-start.mdx?collection=docs"), "concepts/conflicts.mdx": () => import("../content/docs/concepts/conflicts.mdx?collection=docs"), "concepts/gist-storage.mdx": () => import("../content/docs/concepts/gist-storage.mdx?collection=docs"), "concepts/lock-file.mdx": () => import("../content/docs/concepts/lock-file.mdx?collection=docs"), "commands/index.mdx": () => import("../content/docs/commands/index.mdx?collection=docs"), "commands/login.mdx": () => import("../content/docs/commands/login.mdx?collection=docs"), "commands/push.mdx": () => import("../content/docs/commands/push.mdx?collection=docs"), "commands/remove.mdx": () => import("../content/docs/commands/remove.mdx?collection=docs"), "commands/status.mdx": () => import("../content/docs/commands/status.mdx?collection=docs"), "commands/sync.mdx": () => import("../content/docs/commands/sync.mdx?collection=docs"), "commands/whoami.mdx": () => import("../content/docs/commands/whoami.mdx?collection=docs"), "reference/config.mdx": () => import("../content/docs/reference/config.mdx?collection=docs"), "reference/environment.mdx": () => import("../content/docs/reference/environment.mdx?collection=docs"), "reference/exit-codes.mdx": () => import("../content/docs/reference/exit-codes.mdx?collection=docs"), "reference/faq.mdx": () => import("../content/docs/reference/faq.mdx?collection=docs"), }),
};
export default browserCollections;