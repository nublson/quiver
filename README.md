# Quiver

Sync your global AI agent skills across devices.

```bash
npm install -g quiver
```

## Quickstart

```bash
# 1. Authenticate with GitHub
quiver login

# 2. After installing skills on any device, push the lock
npx skills add https://github.com/anthropics/skills --skill frontend-design -g
quiver push

# 3. On a new device — restore everything in one shot
quiver login
quiver sync
```

## Commands

| Command | Description |
|---------|-------------|
| `quiver login` | Authenticate via GitHub OAuth |
| `quiver push` | Upload your local skill lock to GitHub Gist |
| `quiver sync` | Install any skills missing from the remote lock |
| `quiver remove <skill>` | Remove a skill locally and sync the deletion |

## How it works

Quiver reads `~/.agents/.skill-lock.json` (maintained by `npx skills`) and syncs it to a secret GitHub Gist. On a new device, `quiver sync` fetches that Gist and reinstalls any missing skills. Sync is additive — it never removes or overwrites local skills.

---

## Development

| Path | Description |
|------|-------------|
| `apps/web` | Next.js marketing site and docs |
| `packages/cli` | `quiver` CLI (oclif + TypeScript) |

```bash
pnpm install
pnpm dev          # all apps
pnpm build
pnpm lint
pnpm test

# CLI
node packages/cli/bin/run.js --help
pnpm --filter cli dev push   # dev mode, no build
```

**Branches:** `main` (production) · `develop` (staging) · `feature/*` / `fix/*` (work)

See [CLAUDE.md](./CLAUDE.md) for full architecture and design decisions.
