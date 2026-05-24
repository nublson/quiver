import type { Release } from "@/lib/changelog";

export const RELEASES: Release[] = [
  {
    id: "v0-2-4",
    version: "0.2.4",
    tag: "latest",
    sha: "a1f3b29",
    date: "May 18, 2026",
    bumpLabel: "patch · 6 changes",
    stats: { add: 2, chg: 1, fix: 3 },
    summary: (
      <>
        Quieter <code>quiver sync</code> output and a fix for a long-standing
        Windows path bug. If you&apos;ve been seeing <code>EACCES</code>{" "}
        warnings on WSL, this is the one.
      </>
    ),
    sections: [
      {
        type: "add",
        label: "added",
        entries: [
          {
            type: "add",
            text: (
              <>
                <code>--quiet</code> flag on <code>sync</code> and{" "}
                <code>push</code> — only prints the summary line.
              </>
            ),
          },
          {
            type: "add",
            text: (
              <>
                Conditional output coloring honors <code>NO_COLOR</code> and{" "}
                <code>FORCE_COLOR</code> per{" "}
                <a href="https://no-color.org">no-color.org</a>.
              </>
            ),
          },
        ],
      },
      {
        type: "chg",
        label: "changed",
        entries: [
          {
            type: "chg",
            text: (
              <>
                Default <code>sync</code> output now collapses unchanged skills
                into a single line. Pass <code>--verbose</code> for the old
                behavior.
              </>
            ),
          },
        ],
      },
      {
        type: "fix",
        label: "fixed",
        entries: [
          {
            type: "fix",
            text: (
              <>
                Windows path normalization for WSL home directories — no more{" "}
                <code>EACCES</code> on{" "}
                <code>~/.agents/.skill-lock.json</code>.
              </>
            ),
          },
          {
            type: "fix",
            text: (
              <>
                Keychain timeout on Linux when <code>libsecret</code> is
                unavailable now falls back to file storage with a clear warning.
              </>
            ),
          },
          {
            type: "fix",
            text: (
              <>
                Race condition where two rapid <code>push</code> calls could
                produce out-of-order Gist revisions.
              </>
            ),
          },
        ],
      },
    ],
  },
  {
    id: "v0-2-3",
    version: "0.2.3",
    sha: "d7e0c41",
    date: "Apr 30, 2026",
    bumpLabel: "patch · 4 changes",
    stats: { add: 2, chg: 1, fix: 1 },
    summary: (
      <>
        <code>quiver status</code> gets a machine-readable mode, and the device
        flow now opens your browser automatically on macOS and Linux.
      </>
    ),
    sections: [
      {
        type: "add",
        label: "added",
        entries: [
          {
            type: "add",
            text: (
              <>
                <code>quiver status --json</code> emits structured output
                suitable for shell scripts.
              </>
            ),
          },
          {
            type: "add",
            text: (
              <>
                <code>DEBUG=quiver:*</code> environment variable for verbose
                internal logging.
              </>
            ),
          },
        ],
      },
      {
        type: "chg",
        label: "changed",
        entries: [
          {
            type: "chg",
            text: (
              <>
                Device-flow login auto-opens the browser via <code>open</code>{" "}
                / <code>xdg-open</code>. Falls back to the printed URL if
                neither is available.
              </>
            ),
          },
        ],
      },
      {
        type: "fix",
        label: "fixed",
        entries: [
          {
            type: "fix",
            text: "Skills with hyphens in the name were sometimes truncated in the diff view.",
          },
        ],
      },
    ],
  },
  {
    id: "v0-2-2",
    version: "0.2.2",
    sha: "9b2c8e5",
    date: "Apr 14, 2026",
    bumpLabel: "patch · 3 changes",
    stats: { chg: 1, fix: 2 },
    summary:
      "Small reliability pass on the GitHub API client. Retries on transient 5xx responses, plus a clearer error when rate-limited.",
    sections: [
      {
        type: "chg",
        label: "changed",
        entries: [
          {
            type: "chg",
            text: "GitHub API client retries 502/503/504 with exponential backoff (max 3 attempts).",
          },
        ],
      },
      {
        type: "fix",
        label: "fixed",
        entries: [
          {
            type: "fix",
            text: (
              <>
                Rate-limit error now prints the reset timestamp from the{" "}
                <code>X-RateLimit-Reset</code> header instead of a generic
                message.
              </>
            ),
          },
          {
            type: "fix",
            text: (
              <>
                Stale Gist cache on <code>whoami</code> after rotating tokens.
              </>
            ),
          },
        ],
      },
    ],
  },
  {
    id: "v0-2-1",
    version: "0.2.1",
    sha: "3f8a107",
    date: "Mar 28, 2026",
    bumpLabel: "patch · 2 changes",
    stats: { fix: 2 },
    summary: (
      <>
        Hotfix for the <code>0.2.0</code> rollout — <code>quiver remove</code>{" "}
        was leaving an empty entry in the lock file under some conditions.
      </>
    ),
    sections: [
      {
        type: "fix",
        label: "fixed",
        entries: [
          {
            type: "fix",
            text: (
              <>
                <code>quiver remove</code> now atomically rewrites the lock
                file — no more empty <code>{"{}"}</code> entries after
                uninstall.
              </>
            ),
          },
          {
            type: "fix",
            text: (
              <>
                Confirmation prompt for <code>sync --prune</code> was
                suppressed under <code>CI=true</code>; it now requires{" "}
                <code>--yes</code> explicitly.
              </>
            ),
          },
        ],
      },
    ],
  },
  {
    id: "v0-2-0",
    version: "0.2.0",
    tag: "major",
    sha: "c20d4f9",
    date: "Mar 10, 2026",
    bumpLabel: "minor · 7 changes · breaking",
    stats: { add: 3, chg: 2, fix: 1, rm: 1 },
    summary: (
      <>
        <strong>
          Adds the <code>remove</code> command
        </strong>{" "}
        and reworks how the lock file is written — every change is now atomic,
        with a <code>.bak</code> kept until the next successful sync. One small
        breaking change in the config schema.
      </>
    ),
    sections: [
      {
        type: "add",
        label: "added",
        entries: [
          {
            type: "add",
            text: (
              <>
                <code>quiver remove &lt;skill&gt;</code> — uninstall locally,
                repair the lock, push the cleaned version.
              </>
            ),
          },
          {
            type: "add",
            text: (
              <>
                Atomic lock-file writes with rollback. A{" "}
                <code>.skill-lock.json.bak</code> is kept until the next
                successful sync.
              </>
            ),
          },
          {
            type: "add",
            text: (
              <>
                <code>--no-push</code> flag on <code>remove</code> for the
                rare case you want to defer.
              </>
            ),
          },
        ],
      },
      {
        type: "chg",
        label: "changed",
        entries: [
          {
            type: "chg",
            text: (
              <>
                Config schema: <code>autoPush</code> renamed to{" "}
                <code>autoPushOnAdd</code>. Old key still read with a
                deprecation warning until 0.3.
              </>
            ),
          },
          {
            type: "chg",
            text: (
              <>
                Lock-file <code>version</code> bumped from <code>1</code> to{" "}
                <code>2</code>. Older lock files are migrated on first read.
              </>
            ),
          },
        ],
      },
      {
        type: "fix",
        label: "fixed",
        entries: [
          {
            type: "fix",
            text: (
              <>
                Partial writes on power-loss during <code>push</code> no
                longer corrupt the local lock.
              </>
            ),
          },
        ],
      },
      {
        type: "rm",
        label: "removed",
        entries: [
          {
            type: "rm",
            text: (
              <>
                Undocumented <code>quiver wipe</code> alias for{" "}
                <code>sync --prune --yes</code>. Use the long form.
              </>
            ),
          },
        ],
      },
    ],
  },
  {
    id: "v0-1-2",
    version: "0.1.2",
    sha: "71e2a8c",
    date: "Feb 22, 2026",
    bumpLabel: "patch · 3 changes",
    stats: { add: 1, chg: 2 },
    summary: (
      <>
        Introduces <code>quiver status</code> so you can preview a sync before
        running it. Also makes the unified diff colors match{" "}
        <code>git status</code> conventions.
      </>
    ),
    sections: [
      {
        type: "add",
        label: "added",
        entries: [
          {
            type: "add",
            text: (
              <>
                <code>quiver status</code> — unified diff of local vs remote
                without making changes.
              </>
            ),
          },
        ],
      },
      {
        type: "chg",
        label: "changed",
        entries: [
          {
            type: "chg",
            text: (
              <>
                Diff coloring aligned with <code>git status</code> — green
                for adds, red for removes, dim for unchanged.
              </>
            ),
          },
          {
            type: "chg",
            text: (
              <>
                <code>sync</code> now prints the remote revision number
                alongside the skill count.
              </>
            ),
          },
        ],
      },
    ],
  },
  {
    id: "v0-1-1",
    version: "0.1.1",
    sha: "4a0b6d2",
    date: "Feb 05, 2026",
    bumpLabel: "patch · 4 changes",
    stats: { chg: 2, fix: 2 },
    summary:
      "Polish pass after the initial release — clearer errors, faster Gist discovery, and Windows builds verified end-to-end.",
    sections: [
      {
        type: "chg",
        label: "changed",
        entries: [
          {
            type: "chg",
            text: "Gist discovery now caches the resolved ID locally — subsequent syncs skip a round-trip.",
          },
          {
            type: "chg",
            text: "Error messages on missing scopes link directly to the GitHub settings page for re-auth.",
          },
        ],
      },
      {
        type: "fix",
        label: "fixed",
        entries: [
          {
            type: "fix",
            text: "Windows console output no longer mangles unicode glyphs (✓, ←, →).",
          },
          {
            type: "fix",
            text: (
              <>
                <code>quiver --version</code> returned <code>undefined</code>{" "}
                when installed via <code>npx</code>.
              </>
            ),
          },
        ],
      },
    ],
  },
  {
    id: "v0-1-0",
    version: "0.1.0",
    tag: "initial",
    sha: "0000000",
    date: "Jan 22, 2026",
    bumpLabel: "initial · 5 changes",
    stats: { add: 5 },
    summary: (
      <>
        First public release. The core loop —{" "}
        <code>login</code> → <code>push</code> → <code>sync</code> — works
        end-to-end on macOS, Linux, and Windows.
      </>
    ),
    sections: [
      {
        type: "add",
        label: "added",
        entries: [
          {
            type: "add",
            text: (
              <>
                <code>quiver login</code> — GitHub device-flow auth, token
                stored in OS keychain.
              </>
            ),
          },
          {
            type: "add",
            text: (
              <>
                <code>quiver push</code> — read{" "}
                <code>~/.agents/.skill-lock.json</code>, write to a private
                Gist.
              </>
            ),
          },
          {
            type: "add",
            text: (
              <>
                <code>quiver sync</code> — pull the remote lock, install any
                missing skills.
              </>
            ),
          },
          {
            type: "add",
            text: (
              <>
                <code>quiver whoami</code> — show authenticated user, Gist
                ID, last sync timestamp.
              </>
            ),
          },
          {
            type: "add",
            text: "Cross-platform builds: macOS (arm64/x64), Linux (x64/arm64), Windows (x64).",
          },
        ],
      },
    ],
  },
];
