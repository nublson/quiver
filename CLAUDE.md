# Quiver

A CLI sync layer for agent skills. Quiver lets users push and sync their globally installed skills across devices using `~/.agents/.skill-lock.json` as the source of truth.

Skills installed globally via `npx skills add -g` are available across all AI agents (Claude, Gemini, Cursor, and others). Quiver is agent-agnostic — it syncs whatever is in the global lock file, regardless of which agents the skills target.

> **Important:** Quiver only syncs **global** skills (installed with the `-g` flag). Project-level skills are out of scope.

## What quiver is

Quiver is **not** a package manager. It does not install, update, or manage skills directly. That is the job of `npx skills`.

Quiver is a **sync layer**: it reads the lock file that `npx skills` maintains, pushes it to a GitHub Gist, and replays missing installs on other devices.

## What quiver is not

- Not a replacement for `npx skills` — users still install skills the usual way
- Not a registry — quiver does not host or index skills
- Not a file manager — quiver does not own or modify skill files (except during `remove`, which fixes a known bug in `npx skills rm`)

---

## Stack

| Layer | Choice |
|---|---|
| Monorepo | Turborepo |
| CLI | TypeScript + oclif |
| Web + Docs | Next.js + Tailwind + Fumadocs (purely static — no API routes) |
| API | Hono — better-auth only (auth-only, no lock data) |
| Auth | better-auth (GitHub OAuth), runs in `apps/api` |
| Storage | GitHub Gist (one secret Gist per user, managed by the CLI) |
| Deploy | Vercel (web + api) + npm (CLI) |
| Release | Changesets (`@changesets/cli`) — versioning, changelog, npm publish |

## Repo structure

```
quiver/
  apps/
    web/        # Next.js — marketing (/) + docs (/docs), purely static
    api/        # Hono — better-auth only (auth)
  packages/
    cli/        # TypeScript + oclif
```

---

## Commands

### `quiver login`
Authenticates the user via GitHub OAuth (better-auth).
Stores the session token locally (e.g. `~/.quiver/credentials.json`).

### `quiver push`
Reads `~/.agents/.skill-lock.json` and uploads it to the user's secret GitHub Gist.
Run this after installing or removing global skills with `npx skills`.

```
# typical workflow — install globally, then push
npx skills add https://github.com/anthropics/skills --skill frontend-design -g
npx skills add vercel-labs/agent-skills --skill react-best-practices -g
quiver push
```

### `quiver sync`
Fetches the remote lock file from the user's GitHub Gist, diffs it against the local `~/.agents/.skill-lock.json`, and runs `npx skills add -g` for each skill that is missing locally.
Sync only adds — it never overwrites locally modified skills.

```
# on a new device
quiver login
quiver sync
```

### `quiver remove <skill-name>`
Removes a skill locally, fixes the lock file entry (bug in `npx skills rm` — it leaves stale entries), and pushes the updated lock to the GitHub Gist.

```
quiver remove frontend-design
```

### `quiver status`
Shows a diff between the local `~/.agents/.skill-lock.json` and the remote lock.
Useful for seeing what would change before running `push` or `sync`.

```
quiver status

  local only:   pdf-reading
  remote only:  data-analysis
  in sync:      frontend-design, docx, pptx
```

---

## How sync works

1. Fetch lock file from the user's GitHub Gist
2. Read local `~/.agents/.skill-lock.json` (may not exist on a fresh device)
3. Compute diff: skills in remote lock that are absent locally
4. For each missing skill, run `npx skills add <sourceUrl> --skill <skillPath> -g`
5. Write updated `~/.agents/.skill-lock.json`

Sync is **additive only**. It never removes or overwrites local skills.

---

## .skill-lock.json structure

Located at `~/.agents/.skill-lock.json`. Owned and updated by `npx skills` whenever a global skill is installed or removed. Quiver reads this file on `push` and writes it on `sync`.

```json
{
  "version": 3,
  "skills": {
    "frontend-design": {
      "source": "anthropics/skills",
      "sourceType": "github",
      "sourceUrl": "https://github.com/anthropics/skills.git",
      "skillPath": "skills/frontend-design/SKILL.md",
      "skillFolderHash": "928950704df8a8b885c03de5da626331e6f29cf8",
      "installedAt": "2026-05-19T13:36:11.396Z",
      "updatedAt": "2026-05-19T13:36:11.396Z"
    }
  },
  "dismissed": {
    "findSkillsPrompt": true
  },
  "lastSelectedAgents": [
    "claude-code",
    "cursor",
    "gemini-cli",
    "github-copilot"
  ]
}
```

Relevant fields quiver uses during sync:

| Field | Used for |
|---|---|
| `source` | Human-readable origin (e.g. `anthropics/skills`) |
| `sourceUrl` | Passed to `npx skills add <sourceUrl> -g` during sync |
| `skillPath` | Identifies which skill within the repo |
| `skillFolderHash` | Available for a future `quiver upgrade` to detect updates |
| `lastSelectedAgents` | Preserved as-is when writing the lock file — quiver does not modify it |

---

## Storage

Quiver uses **GitHub Gist** as its storage backend. There is no database for skill data — only better-auth's own tables in Supabase Postgres (for session management).

### GitHub Gist

One secret Gist per user, named `quiver-skill-lock.json`. Created automatically on first `quiver push`. The full `.skill-lock.json` content is stored as the Gist file body.

The Gist ID is written to `~/.quiver/credentials.json` after creation and reused on all subsequent pushes and syncs.

### `credentials.json` shape

```json
{
  "token": "<better-auth session token>",
  "username": "githubusername",
  "githubToken": "<github oauth token with gist scope>",
  "gistId": "<id of the user's quiver-skill-lock.json gist>"
}
```

---

## Local file structure

```
~/.quiver/
  credentials.json       # auth token and user info
  device.json            # device name and last sync timestamp

~/.agents/
  .skill-lock.json       # owned by npx skills, read/written by quiver (global skills only)
```

---

## Key design decisions

**Quiver does not proxy `npx skills add`.**
Users install skills however they want — for any agent (Claude, Gemini, Cursor, etc.). Quiver learns about installs via `quiver push`, which reads the lock file after the fact. This keeps quiver decoupled from both the install workflow and any specific agent.

**`~/.agents/.skill-lock.json` is the source of truth.**
Quiver does not maintain its own skill metadata. The global lock file already contains everything needed: sourceUrl (used for reinstalling), skillPath, and a folder hash. Quiver only touches this file — never project-level skill configs.

**`quiver remove` fixes a known `npx skills` bug.**
Running `npx skills rm` removes skill files but leaves stale entries in `~/.agents/.skill-lock.json`. `quiver remove` handles the full cleanup: removes files, fixes the lock file, and pushes the update.

**Sync is additive only (v1).**
Quiver never deletes or overwrites local skills during sync. Conflict resolution is out of scope for v1.

**`apps/api` is auth-only; `apps/web` is purely static.**
The web app (Next.js) contains no API routes — it is marketing and docs only. `apps/api` (Hono) handles only authentication via better-auth. There are no lock storage or sync event endpoints — the CLI talks directly to the GitHub Gist API for all skill data. This keeps the backend surface area minimal and removes the need for any database tables beyond what better-auth requires.

**GitHub Gist is the storage backend.**
Each user's lock file lives in a single secret Gist named `quiver-skill-lock.json`. The CLI manages it directly using the GitHub token obtained during login (with `gist` scope). No server proxy, no database table. Gist revision history provides a free audit log of every push.

**better-auth owns authentication and runs in `apps/api`.**
better-auth handles GitHub OAuth and session management via the Hono adapter. Its tables live in Supabase Postgres. The GitHub OAuth flow also yields a token with `gist` scope, which the CLI stores in `~/.quiver/credentials.json` and uses directly for all Gist operations.

---

## Release workflow

Quiver uses **Changesets** (`@changesets/cli`) for versioning, changelog generation, and npm publishing. It integrates natively with pnpm workspaces and Turborepo.

### Daily workflow

```bash
# after making changes, describe what changed and pick a bump type
pnpm changeset        # patch | minor | major

# commit the generated .changeset/*.md file with your PR
```

### Publishing

Merging to `main` triggers the Changesets GitHub Action, which:

1. Opens a "Version PR" — bumps `packages/cli/package.json` and updates `CHANGELOG.md`
2. Merging the Version PR runs `pnpm changeset publish` — tags the commit and publishes `packages/cli` to npm

Only `packages/cli` is published. `apps/web` and `apps/api` are excluded automatically because they have no `publishConfig` in their `package.json`.

### Key files

| File | Purpose |
|---|---|
| `.changeset/config.json` | Changesets config (scope: `packages/cli` only) |
| `.changeset/*.md` | Per-PR change descriptions (committed, consumed on publish) |
| `packages/cli/CHANGELOG.md` | Auto-generated; also used as the GitHub release body |

---

## Out of scope (v1)

- Team or org sharing — personal sync only
- Project-level skills — only global skills (`-g`) are synced
- `quiver upgrade` — detecting hash changes and updating skills
- Skill file ownership — quiver does not manage skill directories beyond `remove`
- Offline mode
- Multiple profiles or accounts
