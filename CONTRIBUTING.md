# Contributing

## Git workflow

This repository uses a strict branch workflow. Do not commit directly to `main` or `develop`.

| Branch | Role |
|--------|------|
| `main` | Production — always deployable |
| `develop` | Pre-production / staging — integration branch |
| `feature/*` | New work — branch from `develop` |
| `fix/*` | Bug fixes — branch from `develop` |

Flow: `feature/*` or `fix/*` → `develop` → `main`

### Starting work

```bash
git fetch origin
git checkout develop
git pull origin develop
git checkout -b feature/short-description
```

Use lowercase names with hyphens (e.g. `feature/github-oauth`, `fix/login-redirect`).

### Pull requests

- Feature and fix PRs target **`develop`**
- Release PRs promote **`develop`** → **`main`**
- Prefer fast-forward merges when possible
- Delete feature branches after merge

### Commit messages

Format: `feat:`, `fix:`, `refactor:`, or `chore:` followed by a short description.

Examples:

- `feat: add github authentication flow`
- `fix: correct form validation logic`

### GitHub CLI

Use `gh` for branches, pull requests, reviews, and merges.

When the remote is configured:

```bash
gh repo set-default
git push -u origin develop   # first time only
```

Set the default branch to `develop` in GitHub repository settings for day-to-day PRs.
