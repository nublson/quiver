import type { MDXComponents } from "mdx/types";
import Callout from "@/components/docs/callout";
import CmdRef from "@/components/docs/cmd-ref";
import Terminal from "@/components/docs/terminal";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return { Callout, CmdRef, Terminal, ...components };
}
