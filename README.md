# Quiver

CLI sync layer for global agent skills. See [CLAUDE.md](./CLAUDE.md) for product and architecture details.

## Monorepo

| Path | Description |
|------|-------------|
| `apps/web` | Next.js marketing site and docs |
| `packages/cli` | `quiver` CLI (oclif + TypeScript) |

## Development

```bash
pnpm install
pnpm dev          # all apps
pnpm dev --filter=web
pnpm build
pnpm lint
pnpm test

# CLI
node packages/cli/bin/run.js --help
node packages/cli/bin/dev.js hello friend -f oclif   # dev, no build
```

## Git workflow

Use `develop` for integration and open PRs from `feature/*` or `fix/*` branches. See [CONTRIBUTING.md](./CONTRIBUTING.md).

**Branches:** `main` (production) · `develop` (staging) · `feature/*` / `fix/*` (work)

Current work should happen on a feature branch created from `develop`, not on `main` or `develop` directly.
