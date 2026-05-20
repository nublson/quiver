# Quiver Roadmap

> Build order: each phase produces something usable that the next phase builds on.

## Phase 0 — Foundation ✅

> Monorepo scaffolding. Everything needed to start building.

- [x] Turborepo + pnpm workspace
- [x] `packages/cli` — oclif scaffold
- [x] `apps/web` — Next.js 16 + Tailwind v4 scaffold
- [x] GitHub Actions CI (lint + test on push/PR)

---

## Phase 1 — Authentication (`quiver login`) ✅

> A user can authenticate from the terminal. No web UI — the browser is only used as the OAuth handshake surface. All server logic lives in `apps/api`.

**`apps/api` — scaffold**

- [x] Create `apps/api` — Hono app, TypeScript, Vercel deployment config
- [x] Add to Turborepo pipeline

**`apps/api` — better-auth + pg**

- [x] Install and configure better-auth with the Hono adapter
- [x] Wire GitHub OAuth provider
- [x] Mount better-auth handler at `/auth/*`
- [x] Device Authorization plugin (`POST /auth/device/code`, `POST /auth/device/token`, `/auth/device/*`) + browser verification at `GET /device`
- [x] Configure `pg.Pool` → Supabase Postgres (better-auth accepts it natively)
- [x] Set environment variables (`BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `DATABASE_URL`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`)
- [x] Apply initial schema migrations against real Supabase
- [x] Deploy `apps/api` to Vercel (OAuth callback must be reachable at `api.quiver.nublson.com`)

---

### Phase 1.5 — Storage Architecture Switch ✅

> Switch from Supabase + `apps/api` lock endpoints to GitHub Gist as the storage backend. Quiver is a personal CLI tool with no server-side data needs — Gist is simpler and removes the database entirely.

**`apps/api` — remove lock infrastructure**

- [x] Remove `skill_locks` table — never built; Supabase schema is auth-only
- [x] Remove `sync_events` table — never built
- [x] Remove `POST /locks` and `GET /locks` endpoints — never built
- [x] Remove `DATABASE_URL` dependency from lock-related code — no lock code existed
- [x] Remove Supabase client package — was never added

**`apps/api` — Gist token exchange**

- [x] After device auth completes, request a GitHub token with `gist` scope in addition to `read:user`
- [x] Return GitHub token to the CLI at login time (wired during `quiver login` — Phase 1)

**CLI — Gist utilities (`src/lib/gist.ts`)**

- [x] `findOrCreateGist()` — list user's gists, find one named `quiver-skill-lock.json`, create it as secret if absent; store Gist ID in `~/.quiver/credentials.json`
- [x] `readGist(gistId)` — fetch and parse the Gist content as a lock file
- [x] `writeGist(gistId, lockData)` — patch the Gist with updated lock content

**CLI — update `~/.quiver/credentials.json` shape**

- [x] Add `githubToken` field (used exclusively for Gist API calls)
- [x] Add `gistId` field (written on first push, reused on all subsequent operations)

**Deliverable:** CLI can read and write lock data via GitHub Gist. `apps/api` is auth-only — no database tables for skill data. ✅

---

**CLI — `quiver login`**

- [x] Call `POST /auth/device/code` with `client_id` (matches `QUIVER_DEVICE_CLIENT_ID`, default `quiver-cli`)
- [x] Print user code / open `verification_uri_complete` in the browser (`GET /device?user_code=...`)
- [x] Poll `POST /auth/device/token` until `access_token` is returned (RFC 8628)
- [x] Store token + GitHub username + `githubToken` in `~/.quiver/credentials.json`
- [x] Print confirmation (`Logged in as @username`)

**Deliverable:** `quiver login` works end-to-end on a real machine. ✅

---

## Phase 2 — Push (`quiver push`) ✅

> A user can upload their local skill lock to GitHub Gist after installing skills.

**CLI — shared utilities**

- [x] `src/lib/credentials.ts` — read token, GitHub token, Gist ID, and user info from `~/.quiver/credentials.json`
- [x] `src/lib/lock-file.ts` — read `~/.agents/.skill-lock.json`

**CLI — `quiver push`**

- [x] Read local `~/.agents/.skill-lock.json`
- [x] Call `findOrCreateGist()` — resolve or create the user's secret Gist, persist `gistId` to credentials
- [x] Call `writeGist(gistId, lockData)` — patch the Gist with current lock content
- [x] Print count of skills pushed and timestamp

**Deliverable:** `npx skills add ... -g && quiver push` uploads the lock to GitHub Gist.

---

## Phase 3 — Sync (`quiver sync`) ✅

> A user on a new device can install all their skills with one command.

**CLI — `quiver sync`**

- [x] Call `readGist(gistId)` — fetch remote lock from GitHub Gist
- [x] Read local `~/.agents/.skill-lock.json` (handle missing file gracefully)
- [x] Diff: collect skills in remote that are absent locally
- [x] For each missing skill, run `npx skills add <sourceUrl> --skill <skillPath> -g -y`
- [x] Write updated `~/.agents/.skill-lock.json`
- [x] Print summary (`3 skills added, 2 already up to date`)

---

## Phase 4 — Release ✅

> Ship quiver as a public npm package. `quiver remove` ships here — before the public publish — because it fixes a data integrity bug in `npx skills rm` that would affect users immediately.

**CLI — `quiver remove <skill-name>`**

- [x] Find the skill entry in local lock file
- [x] Run `npx skills rm <skillPath>` (removes skill files)
- [x] Remove the stale entry from `~/.agents/.skill-lock.json` (fixes the npx skills rm bug)
- [x] Call push logic to sync the removal to the cloud
- [x] Print confirmation

**Release**

- [x] Remove oclif placeholder commands (`hello`, `hello world`)
- [x] Set correct `version`, `description`, and `author` in `packages/cli/package.json`
- [x] Install and configure Changesets (`pnpm add -D @changesets/cli && pnpm changeset init`)
- [x] Scope `.changeset/config.json` to `packages/cli` only (exclude `apps/*`)
- [x] Add release GitHub Action — manual `workflow_dispatch` merges `develop → main`, validates build, runs `pnpm changeset publish`
- [x] Update repo-root `README.md` — install + quickstart
- [x] Rename npm package to `usequiver` (binary remains `quiver`)
- [x] `npm pack` dry-run — verify tarball contents
- [x] Tag `v0.1.0` + create GitHub release with changelog
- [x] Smoke-test on a clean machine: `npm i -g usequiver && quiver login && quiver sync`

**Deliverable:** `usequiver` is live on npm and usable by anyone. On a fresh machine — `quiver login && quiver sync` — restores all skills. `quiver remove` ensures the lock file stays clean from day one.

---

## Phase 5 — Status ✅

> The last utility command that rounds out the daily workflow.

**CLI — `quiver status`**

- [x] Call `readGist(gistId)` — fetch remote lock from GitHub Gist
- [x] Read local lock file
- [x] Compute three sets: local only / remote only / in sync
- [x] Print formatted diff (mirrors the CLAUDE.md example output)

**Deliverable:** Full CLI surface is functional. Users can manage their skill set entirely from the terminal.

---

## Phase 6 — Web (Marketing + Docs)



> Public-facing site. No auth, no dashboard — purely informational.

**Marketing (`/`)**

- [ ] Hero — one-line value prop + install snippet (`npm install -g usequiver`)
- [ ] How it works — 3-step visual (push → cloud → sync)
- [ ] Command reference quick-look
- [ ] CTA to docs

**Docs (`/docs`) — Fumadocs**

- [ ] Install and configure Fumadocs in `apps/web`
- [ ] Getting Started (install, login, first push, sync on a new device)
- [ ] Commands — `login`, `push`, `sync`, `status`, `remove`
- [ ] How sync works (lock file, additive-only, conflict model)
- [ ] `.skill-lock.json` format reference
- [ ] FAQ (quiver vs npx skills, what quiver does not do, multiple devices)

**Deliverable:** Someone landing on the site understands what quiver is and can get started.

---

## Deferred (Post-v1)

- `quiver upgrade` — detect `skillFolderHash` changes and reinstall updated skills
- `usequiver.sh` domain (once purchased)
- Team / org sharing
- Project-level skill support
- Offline mode
- Multiple accounts / profiles
