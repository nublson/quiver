# Quiver — Improvements & Feature Ideas

## CLI improvements

### `quiver upgrade`
Compare `skillFolderHash` in the local lock against the remote Gist, identify stale skills, and re-run `npx skills add -g` on them. All the primitives (lock file, gist, `runSkillsAdd`) are already in place — medium-sized command. Already called out as v2 in the spec.

### `quiver logout`
No way to clear `~/.quiver/credentials.json` cleanly. Trivially small but a real UX gap.

### `quiver list`
Read-only command that prints all installed global skills with their source and `installedAt` date. Useful without needing to inspect the lock file manually.

### `quiver push --dry-run` / `quiver sync --dry-run`
Let users preview what would happen before committing. The `status` command covers the same info but requires a separate invocation — flags would make it part of the natural workflow.

### `--force` flag on `sync`
Sync is additive only by design, but power users will want a way to overwrite locally diverged skills with the remote copy. An explicit override flag keeps the safe default while unlocking the escape hatch.

### Device name in `device.json`
`~/.quiver/device.json` is mentioned in the spec but never created anywhere in the codebase. Stamping it on `login` or `push` with the machine hostname would unlock a future `quiver devices` command showing which machines have synced.

---

## Reliability & correctness

### Gist pagination
`findOrCreateGist` only looks at the first 100 Gists (`gist.ts`). If the user has >100, their quiver Gist might never be found and a duplicate gets created silently. Needs `Link` header pagination to fully fix.

### Lock file schema validation
The code JSON-parses whatever is in the Gist and trusts the shape. A lightweight Zod schema on read would catch corruption or manual edits early with a clear error message.

### Atomic lock file writes
`writeLockFile` writes directly to `.skill-lock.json`. If the process is killed mid-write the file is corrupt. Write to `.skill-lock.json.tmp` first, then `rename` — one-liner fix.

---

## Web & docs

### Interactive terminal demo on landing page
Show a `quiver push` / `quiver sync` terminal animation to make the value prop immediately obvious to first-time visitors.

### Gist URL in `whoami`
Currently shows the raw Gist ID. Linking to `https://gist.github.com/<username>/<gistId>` would let users verify their data in the browser directly.

### Docs page for `quiver upgrade`
When the upgrade command ships, `apps/web/src/app/docs/commands/` will need a corresponding page.

---

## Priority order

| # | Item | Effort | Notes |
|---|------|--------|-------|
| 1 | `quiver logout` | ~30 min | Obvious UX gap, no risk |
| 2 | `quiver list` | ~1 hour | Makes the tool self-documenting |
| 3 | `device.json` stamping | ~1 hour | Enables future roadmap |
| 4 | `quiver upgrade` | ~half day | Most-requested v2 feature per spec |
| 5 | Gist pagination fix | ~1 hour | Real production bug for heavy Gist users |
