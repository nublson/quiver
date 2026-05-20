usequiver
=================

Keep your AI agent skills in sync across every device

## Why Quiver?

You set up your AI agent skills once — then you switch machines and they're gone.

Quiver fixes that. Run `quiver push` after installing skills on any machine.
Run `quiver sync` on a new device to restore everything in one command.

Your skills stay in a **private GitHub Gist** you own. No new account, no service,
no proprietary backend. Just your GitHub account and the skills you already have.

Works with **Claude Code, Cursor, Gemini CLI, GitHub Copilot** — any agent that
reads from the global skill lock (`~/.agents/.skill-lock.json`).

## Quick Start

```sh
npm install -g usequiver

quiver login   # connect your GitHub account
quiver push    # save your skills to your private Gist
quiver sync    # restore on any new machine
```

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/usequiver.svg)](https://npmjs.org/package/usequiver)
[![Downloads/week](https://img.shields.io/npm/dw/usequiver.svg)](https://npmjs.org/package/usequiver)


<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g usequiver
$ quiver COMMAND
running command...
$ quiver (--version)
usequiver/0.1.0 darwin-arm64 node-v25.2.1
$ quiver --help [COMMAND]
USAGE
  $ quiver COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`quiver help [COMMAND]`](#quiver-help-command)
* [`quiver login`](#quiver-login)
* [`quiver push`](#quiver-push)
* [`quiver remove SKILL_NAME`](#quiver-remove-skill_name)
* [`quiver sync`](#quiver-sync)

## `quiver help [COMMAND]`

Display help for quiver.

```
USAGE
  $ quiver help [COMMAND...] [-n]

ARGUMENTS
  [COMMAND...]  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for quiver.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/6.2.49/src/commands/help.ts)_

## `quiver login`

Authenticate with GitHub

```
USAGE
  $ quiver login

DESCRIPTION
  Authenticate with GitHub

EXAMPLES
  $ quiver login
```

_See code: [src/commands/login.ts](https://github.com/nublson/quiver/blob/v0.1.0/src/commands/login.ts)_

## `quiver push`

Upload your local skill lock to GitHub Gist

```
USAGE
  $ quiver push

DESCRIPTION
  Upload your local skill lock to GitHub Gist

EXAMPLES
  $ quiver push
```

_See code: [src/commands/push.ts](https://github.com/nublson/quiver/blob/v0.1.0/src/commands/push.ts)_

## `quiver remove SKILL_NAME`

Remove a global skill and sync the removal to GitHub Gist

```
USAGE
  $ quiver remove SKILL_NAME

ARGUMENTS
  SKILL_NAME  Skill name to remove

DESCRIPTION
  Remove a global skill and sync the removal to GitHub Gist

EXAMPLES
  $ quiver remove frontend-design
```

_See code: [src/commands/remove.ts](https://github.com/nublson/quiver/blob/v0.1.0/src/commands/remove.ts)_

## `quiver sync`

Install missing global skills from your GitHub Gist lock

```
USAGE
  $ quiver sync

DESCRIPTION
  Install missing global skills from your GitHub Gist lock

EXAMPLES
  $ quiver sync
```

_See code: [src/commands/sync.ts](https://github.com/nublson/quiver/blob/v0.1.0/src/commands/sync.ts)_
<!-- commandsstop -->
