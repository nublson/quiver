# Quiver — Product Marketing Context

## Product

**Name:** Quiver (CLI: `usequiver`, command: `quiver`)
**Tagline:** Keep your AI agent skills in sync across every device
**npm:** https://www.npmjs.com/package/usequiver
**Website:** https://quiver.nublson.com (moving to usequiver.sh)
**GitHub:** https://github.com/nublson/quiver

## What It Is

Quiver is a CLI sync layer for AI agent skills. It lets developers keep their globally installed agent skills (`~/.agents/.skill-lock.json`) in sync across multiple devices using a private GitHub Gist as the storage backend.

Skills installed via `npx skills add -g` work across all AI coding agents (Claude Code, Gemini CLI, Cursor, GitHub Copilot, and others). Quiver is agent-agnostic — it syncs whatever is in the global lock file.

## Core Commands

- `quiver login` — Authenticate via GitHub OAuth Device Flow
- `quiver push` — Upload your local skill lock to GitHub Gist
- `quiver sync` — Download remote lock and install any missing skills
- `quiver remove <skill>` — Remove a skill and push the updated lock
- `quiver status` — Diff local vs remote lock (see what would change)

## Target Audience

**Primary:** Developers who use AI coding agents (Claude Code, Cursor, Gemini CLI, GitHub Copilot) on multiple machines and install custom skills globally.

**Profile:**
- Power users of AI coding tools
- Work across 2+ machines (home + work, Mac + laptop, etc.)
- Already familiar with `npx skills` / agent skill system
- Frustrated by having to reinstall skills manually on each device
- Value developer experience and clean CLI tooling

**Pain point they feel:**
"I set up all my skills on my work machine and now I'm on my personal Mac and nothing is there."

## Positioning

**Category:** Developer tooling / AI workflow
**Against:** Manual reinstallation, no sync at all, ad-hoc dotfile scripts
**Unique angle:** Uses GitHub Gist (something devs already trust) as the backend — no new account, no new service, no database. Auth is pure GitHub OAuth.

## Key Value Props (priority order)

1. **Zero friction sync** — one command (`quiver sync`) restores all your skills on a new device
2. **GitHub-native** — uses your existing GitHub account and a private Gist; nothing new to trust
3. **Agent-agnostic** — works with Claude Code, Cursor, Gemini CLI, Copilot — any agent that uses the global skill lock
4. **Non-destructive** — sync is additive only; never overwrites local work
5. **Open source** — MIT license, inspect the code

## Tone & Voice

- Technical but friendly — speak developer-to-developer
- Direct and confident — no filler words, no hype
- Honest about what it is and isn't (not a package manager, not a registry)
- Slightly opinionated (like the engineers who built it)

## What Quiver Is NOT

- Not a skill registry or marketplace
- Not a package manager
- Not a replacement for `npx skills`
- Not a cloud service (no proprietary backend for skill data)
- Does not manage project-level skills — global only

## Current Stage

- Public beta / early release (v0.2.x)
- CLI published to npm
- Web app (marketing + docs) live at quiver.nublson.com
- No paid tier — fully free and open source

## Metrics That Matter

- npm weekly downloads
- GitHub stars
- CLI installs retained after 7 days (implied by `quiver push` usage)

## Competitors / Alternatives

- **Manual dotfiles** — devs sometimes script their own skill installs; high friction, error-prone
- **Nothing** — most users just reinstall skills manually each time; biggest competitor
- No direct CLI competitor exists yet in this space

## Customer Language (real pain points)

- "I switched machines and lost all my skills"
- "I have to set up everything again from scratch"
- "I wish my AI setup followed me across devices"
- "I want my Claude skills on my work and home machine"
