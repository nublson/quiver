// @ts-nocheck
import * as __fd_glob_21 from "../content/docs/reference/faq.mdx?collection=docs"
import * as __fd_glob_20 from "../content/docs/reference/exit-codes.mdx?collection=docs"
import * as __fd_glob_19 from "../content/docs/reference/environment.mdx?collection=docs"
import * as __fd_glob_18 from "../content/docs/reference/config.mdx?collection=docs"
import * as __fd_glob_17 from "../content/docs/commands/whoami.mdx?collection=docs"
import * as __fd_glob_16 from "../content/docs/commands/sync.mdx?collection=docs"
import * as __fd_glob_15 from "../content/docs/commands/status.mdx?collection=docs"
import * as __fd_glob_14 from "../content/docs/commands/remove.mdx?collection=docs"
import * as __fd_glob_13 from "../content/docs/commands/push.mdx?collection=docs"
import * as __fd_glob_12 from "../content/docs/commands/login.mdx?collection=docs"
import * as __fd_glob_11 from "../content/docs/commands/index.mdx?collection=docs"
import * as __fd_glob_10 from "../content/docs/concepts/lock-file.mdx?collection=docs"
import * as __fd_glob_9 from "../content/docs/concepts/gist-storage.mdx?collection=docs"
import * as __fd_glob_8 from "../content/docs/concepts/conflicts.mdx?collection=docs"
import * as __fd_glob_7 from "../content/docs/quick-start.mdx?collection=docs"
import * as __fd_glob_6 from "../content/docs/install.mdx?collection=docs"
import * as __fd_glob_5 from "../content/docs/index.mdx?collection=docs"
import * as __fd_glob_4 from "../content/docs/authentication.mdx?collection=docs"
import { default as __fd_glob_3 } from "../content/docs/reference/meta.json?collection=docs"
import { default as __fd_glob_2 } from "../content/docs/concepts/meta.json?collection=docs"
import { default as __fd_glob_1 } from "../content/docs/commands/meta.json?collection=docs"
import { default as __fd_glob_0 } from "../content/docs/meta.json?collection=docs"
import { server } from 'fumadocs-mdx/runtime/server';
import type * as Config from '../source.config';

const create = server<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>({"doc":{"passthroughs":["extractedReferences"]}});

export const docs = await create.docs("docs", "content/docs", {"meta.json": __fd_glob_0, "commands/meta.json": __fd_glob_1, "concepts/meta.json": __fd_glob_2, "reference/meta.json": __fd_glob_3, }, {"authentication.mdx": __fd_glob_4, "index.mdx": __fd_glob_5, "install.mdx": __fd_glob_6, "quick-start.mdx": __fd_glob_7, "concepts/conflicts.mdx": __fd_glob_8, "concepts/gist-storage.mdx": __fd_glob_9, "concepts/lock-file.mdx": __fd_glob_10, "commands/index.mdx": __fd_glob_11, "commands/login.mdx": __fd_glob_12, "commands/push.mdx": __fd_glob_13, "commands/remove.mdx": __fd_glob_14, "commands/status.mdx": __fd_glob_15, "commands/sync.mdx": __fd_glob_16, "commands/whoami.mdx": __fd_glob_17, "reference/config.mdx": __fd_glob_18, "reference/environment.mdx": __fd_glob_19, "reference/exit-codes.mdx": __fd_glob_20, "reference/faq.mdx": __fd_glob_21, });