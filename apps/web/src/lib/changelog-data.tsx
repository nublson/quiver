import type { Release } from "@/lib/changelog";

export const RELEASES: Release[] = [
  {
    id: "v0-2-6",
    version: "0.2.6",
    tag: "latest",
    sha: "0581f70",
    date: "May 22, 2026",
    bumpLabel: "patch · 3 changes",
    stats: { add: 1, fix: 2 },
    summary: (
      <>
        UX polish across <code>push</code>, <code>remove</code>, and{" "}
        <code>status</code>. Progress bars via listr2, a redesigned status
        diff, and two correctness fixes that would bite you on a real
        multi-skill setup.
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
                listr2 progress bars on <code>push</code> and{" "}
                <code>remove</code>, plus a redesigned <code>status</code>{" "}
                output — columns, color-coded diff, and a concise summary
                line.
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
                <code>quiver remove</code> was deleting from the wrong path —
                skills now removed from <code>~/.agents/skills</code> as
                intended.
              </>
            ),
          },
          {
            type: "fix",
            text: (
              <>
                <code>status</code> command now correctly types the local
                skills map, fixing edge-case crashes when the lock file had
                non-string values.
              </>
            ),
          },
        ],
      },
    ],
  },
  {
    id: "v0-2-5",
    version: "0.2.5",
    sha: "6c81730",
    date: "May 22, 2026",
    bumpLabel: "patch · 2 changes",
    stats: { add: 1, chg: 1 },
    summary: (
      <>
        <code>quiver sync</code> now installs skills in parallel and groups
        them by source repo — a single <code>npx skills add</code> per
        repository instead of one per skill. Significant speed-up on
        large lock files.
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
                Parallel skill installs with listr2 progress and lock file
                reconciliation — missing skills install concurrently instead
                of sequentially.
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
                Skills sharing a <code>sourceUrl</code> are batched into a
                single <code>npx skills add</code> invocation, cutting one
                process spawn per skill down to one per repository.
              </>
            ),
          },
        ],
      },
    ],
  },
  {
    id: "v0-2-4",
    version: "0.2.4",
    sha: "abae200",
    date: "May 22, 2026",
    bumpLabel: "patch · 1 change",
    stats: { chg: 1 },
    summary: "Metadata-only release. No CLI behavior changes.",
    sections: [
      {
        type: "chg",
        label: "changed",
        entries: [
          {
            type: "chg",
            text: (
              <>
                Updated <code>homepage</code> URL in{" "}
                <code>package.json</code> to reflect the new site address.
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
    sha: "ec83726",
    date: "May 20, 2026",
    bumpLabel: "patch · 2 changes",
    stats: { chg: 1, fix: 1 },
    summary:
      "Package description update and a fix to the release pipeline so GitHub Releases are created automatically on publish.",
    sections: [
      {
        type: "chg",
        label: "changed",
        entries: [
          {
            type: "chg",
            text: "Updated npm package description for clarity.",
          },
        ],
      },
      {
        type: "fix",
        label: "fixed",
        entries: [
          {
            type: "fix",
            text: "Release pipeline now creates a GitHub Release automatically after each Changesets publish.",
          },
        ],
      },
    ],
  },
  {
    id: "v0-2-2",
    version: "0.2.2",
    sha: "70f72a2",
    date: "May 20, 2026",
    bumpLabel: "patch · 2 changes",
    stats: { add: 1, fix: 1 },
    summary: (
      <>
        Fixed a sync bug where skills were installed under the wrong name, and
        added short aliases <code>-v</code> / <code>-h</code> for power users.
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
                <code>-v</code> and <code>-h</code> as short flags for{" "}
                <code>--version</code> and <code>--help</code>.
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
                <code>quiver sync</code> was using the <code>skillPath</code>{" "}
                folder as the skill name instead of the lock file entry key —
                skills with nested paths could install under the wrong name.
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
    sha: "aad6bd3",
    date: "May 20, 2026",
    bumpLabel: "patch · 2 changes",
    stats: { add: 1, fix: 1 },
    summary: (
      <>
        Replaced the better-auth dependency with GitHub&apos;s native device
        flow — simpler auth stack, no backend session table, token stored
        directly in <code>~/.quiver/credentials.json</code>.
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
                GitHub native OAuth device flow for <code>quiver login</code>{" "}
                — opens <code>github.com/login/device</code>, prompts for the
                one-time code, stores the token locally. No server session
                required.
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
            text: "Switched API to Supabase transaction-mode pooler to fix connection exhaustion under serverless cold starts.",
          },
        ],
      },
    ],
  },
  {
    id: "v0-2-0",
    version: "0.2.0",
    tag: "major",
    sha: "d950b58",
    date: "May 20, 2026",
    bumpLabel: "minor · 1 change",
    stats: { add: 1 },
    summary: (
      <>
        Adds <strong>
          <code>quiver status</code>
        </strong>{" "}
        — a dry-run diff of your local lock file against the remote Gist.
        See what&apos;s local-only, remote-only, and in sync before committing
        to a push or sync.
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
                <code>quiver status</code> — shows a three-column diff
                (local only · remote only · in sync) without making any
                changes.
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
    sha: "3618771",
    date: "May 20, 2026",
    bumpLabel: "initial · 4 changes",
    stats: { add: 4 },
    summary: (
      <>
        First public release. The core loop —{" "}
        <code>login</code> → <code>push</code> → <code>sync</code> — works
        end-to-end. Skills are stored in a private GitHub Gist; no server
        stores your data.
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
                stored in <code>~/.quiver/credentials.json</code>.
              </>
            ),
          },
          {
            type: "add",
            text: (
              <>
                <code>quiver push</code> — reads{" "}
                <code>~/.agents/.skill-lock.json</code> and uploads it to a
                private GitHub Gist.
              </>
            ),
          },
          {
            type: "add",
            text: (
              <>
                <code>quiver sync</code> — fetches the remote lock, diffs it
                against local, and runs <code>npx skills add -g</code> for
                each missing skill.
              </>
            ),
          },
          {
            type: "add",
            text: (
              <>
                <code>quiver remove &lt;skill&gt;</code> — removes locally,
                repairs the lock file (works around a bug in{" "}
                <code>npx skills rm</code>), and pushes the cleaned version.
              </>
            ),
          },
        ],
      },
    ],
  },
];
