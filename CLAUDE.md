# Quiver

A CLI sync layer for agent skills. Quiver lets users push and sync their globally installed skills across devices using `~/.agents/.skill-lock.json` as the source of truth.

Skills installed globally via `npx skills add -g` are available across all AI agents (Claude, Gemini, Cursor, and others). Quiver is agent-agnostic — it syncs whatever is in the global lock file, regardless of which agents the skills target.

> **Important:** Quiver only syncs **global** skills (installed with the `-g` flag). Project-level skills are out of scope.

## What quiver is

Quiver is **not** a package manager. It does not install, update, or manage skills directly. That is the job of `npx skills`.

Quiver is a **sync layer**: it reads the lock file that `npx skills` maintains, pushes it to a cloud database, and replays missing installs on other devices.

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
| Web + Docs | Next.js + Tailwind + Fumadocs |
| Auth | better-auth (GitHub OAuth) |
| Database | Supabase (Postgres + JSONB) |
| Deploy | Vercel (web) + npm (CLI) |

## Repo structure

```
quiver/
  apps/
    web/        # Next.js — marketing (/) + docs (/docs)
  packages/
    cli/        # TypeScript + oclif
```

---

## Commands

### `quiver login`
Authenticates the user via GitHub OAuth (better-auth).
Stores the session token locally (e.g. `~/.quiver/credentials.json`).

### `quiver push`
Reads `~/.agents/.skill-lock.json` and uploads it to the cloud database for the current user.
Run this after installing or removing global skills with `npx skills`.

```
# typical workflow — install globally, then push
npx skills add https://github.com/anthropics/skills --skill frontend-design -g
npx skills add vercel-labs/agent-skills --skill react-best-practices -g
quiver push
```

### `quiver sync`
Fetches the remote lock file from the cloud, diffs it against the local `~/.agents/.skill-lock.json`, and runs `npx skills add -g` for each skill that is missing locally.
Sync only adds — it never overwrites locally modified skills.

```
# on a new device
quiver login
quiver sync
```

### `quiver remove <skill-name>`
Removes a skill locally, fixes the lock file entry (bug in `npx skills rm` — it leaves stale entries), and pushes the updated lock to the cloud.

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

1. Fetch `lock_data` from Supabase for the current user
2. Read local `~/.agents/.skill-lock.json` (may not exist on a fresh device)
3. Compute diff: skills in remote lock that are absent locally
4. For each missing skill, run `npx skills add <sourceUrl> --skill <skillPath> -g`
5. Write updated `~/.agents/.skill-lock.json`
6. Record sync event in `sync_events` table

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

## Database schema

Auth-managed users are handled by better-auth. The following tables live in Supabase Postgres alongside better-auth's own tables.

```sql
-- one row per user, stores the full lock file
create table skill_locks (
  id         uuid primary key default gen_random_uuid(),
  user_id    text not null unique,   -- references better-auth user id
  lock_data  jsonb not null,
  updated_at timestamptz default now()
);

-- per-device sync history (optional for v1)
create table sync_events (
  id           uuid primary key default gen_random_uuid(),
  user_id      text not null,        -- references better-auth user id
  device_name  text not null,
  synced_at    timestamptz default now(),
  skills_added text[]
);
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

**better-auth owns authentication.**
better-auth handles GitHub OAuth and session management. Its tables live in the same Supabase Postgres database. `skill_locks` and `sync_events` reference users by better-auth's user id.

---

## Out of scope (v1)

- Team or org sharing — personal sync only
- Project-level skills — only global skills (`-g`) are synced
- `quiver upgrade` — detecting hash changes and updating skills
- Skill file ownership — quiver does not manage skill directories beyond `remove`
- Offline mode
- Multiple profiles or accounts
