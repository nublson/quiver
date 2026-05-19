# Quiver Roadmap

> Build order: each phase produces something usable that the next phase builds on.

## Phase 0 — Foundation ✅
> Monorepo scaffolding. Everything needed to start building.

- [x] Turborepo + pnpm workspace
- [x] `packages/cli` — oclif scaffold
- [x] `apps/web` — Next.js 16 + Tailwind v4 scaffold
- [x] GitHub Actions CI (lint + test on push/PR)

---

## Phase 1 — Authentication (`quiver login`) 🚧
> A user can authenticate from the terminal. No web UI — the browser is only used as the OAuth handshake surface. All server logic lives in `apps/api`.

**`apps/api` — scaffold**
- [x] Create `apps/api` — Hono app, TypeScript, Vercel deployment config
- [x] Add to Turborepo pipeline

**`apps/api` — better-auth + Prisma**
- [x] Install and configure better-auth with the Hono adapter
- [x] Wire GitHub OAuth provider
- [x] Mount better-auth handler at `/auth/*`
- [x] Add `GET /auth/cli-token?state=<state>` — issues a short-lived token after OAuth completes
- [x] Configure Prisma v7 with `@prisma/adapter-pg` → Supabase Postgres
- [x] Set environment variables (`BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `DATABASE_URL`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`)
- [x] Run `pnpm db:migrate --name init` against real Supabase
- [ ] Deploy `apps/api` to Vercel (OAuth callback must be reachable at `api.quiver.nublson.com`)

**CLI — `quiver login`**
- [ ] Generate a random `state` value
- [ ] Open browser to `https://api.quiver.nublson.com/auth/signin/github?state=<state>`
- [ ] Poll `GET /auth/cli-token?state=<state>` until a token is returned (or timeout)
- [ ] Store token + GitHub username in `~/.quiver/credentials.json`
- [ ] Print confirmation (`Logged in as @username`)

**Deliverable:** `quiver login` works end-to-end on a real machine.

---

## Phase 2 — Push (`quiver push`)
> A user can upload their local skill lock to the cloud after installing skills.

**Supabase**
- [ ] Create Supabase project
- [ ] Apply `skill_locks` table schema (`id`, `user_id`, `lock_data jsonb`, `updated_at`)
- [ ] Configure RLS — users can only read/write their own row

**`apps/api` — locks endpoint**
- [ ] `POST /locks` — upsert `lock_data` for the authenticated user (Bearer token auth)

**CLI — shared utilities**
- [ ] `src/lib/credentials.ts` — read token + user info from `~/.quiver/credentials.json`
- [ ] `src/lib/lock-file.ts` — read `~/.agents/.skill-lock.json`
- [ ] `src/lib/api.ts` — typed fetch wrapper pointing to `apps/api` (attaches Bearer token, handles 401)

**CLI — `quiver push`**
- [ ] Read local `~/.agents/.skill-lock.json`
- [ ] `POST /api/locks` with the full lock file as `lock_data`
- [ ] Print count of skills pushed and timestamp

**Deliverable:** `npx skills add ... -g && quiver push` uploads the lock to the cloud.

---

## Phase 3 — Sync (`quiver sync`)
> A user on a new device can install all their skills with one command.

**`apps/api` — locks endpoint**
- [ ] `GET /locks` — return current `lock_data` for the authenticated user

**CLI — `quiver sync`**
- [ ] `GET /api/locks` — fetch remote lock
- [ ] Read local `~/.agents/.skill-lock.json` (handle missing file gracefully)
- [ ] Diff: collect skills in remote that are absent locally
- [ ] For each missing skill, run `npx skills add <sourceUrl> --skill <skillPath> -g`
- [ ] Write updated `~/.agents/.skill-lock.json`
- [ ] Print summary (`3 skills added, 2 already up to date`)

**Deliverable:** On a fresh machine — `quiver login && quiver sync` — restores all skills.

---

## Phase 4 — Status & Remove
> The two utility commands that round out the daily workflow.

**CLI — `quiver status`**
- [ ] `GET /api/locks` — fetch remote lock
- [ ] Read local lock file
- [ ] Compute three sets: local only / remote only / in sync
- [ ] Print formatted diff (mirrors the CLAUDE.md example output)

**CLI — `quiver remove <skill-name>`**
- [ ] Find the skill entry in local lock file
- [ ] Run `npx skills rm <skillPath>` (removes skill files)
- [ ] Remove the stale entry from `~/.agents/.skill-lock.json` (fixes the npx skills rm bug)
- [ ] Call push logic to sync the removal to the cloud
- [ ] Print confirmation

**`apps/api` — sync events endpoint**
- [ ] `POST /sync-events` — record device name + skills added (used by sync)

**Deliverable:** Full CLI surface is functional. Users can manage their skill set entirely from the terminal.

---

## Phase 5 — Web (Marketing + Docs)
> Public-facing site. No auth, no dashboard — purely informational.

**Marketing (`/`)**
- [ ] Hero — one-line value prop + install snippet (`npm install -g quiver`)
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

## Phase 6 — Release
> Ship quiver as a public npm package.

- [ ] Remove oclif placeholder commands (`hello`, `hello world`)
- [ ] Set correct `version`, `description`, and `author` in `packages/cli/package.json`
- [ ] Update repo-root `README.md` — install + quickstart
- [ ] `npm pack` dry-run — verify tarball contents
- [ ] Publish `quiver` to npm
- [ ] Tag `v0.1.0` + create GitHub release with changelog
- [ ] Smoke-test on a clean machine: `npm i -g quiver && quiver login && quiver sync`

---

## Deferred (Post-v1)

- `quiver upgrade` — detect `skillFolderHash` changes and reinstall updated skills
- `usequiver.sh` domain (once purchased)
- Team / org sharing
- Project-level skill support
- Offline mode
- Multiple accounts / profiles
