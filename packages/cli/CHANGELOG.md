# quiver

## 0.2.7

### Patch Changes

- [#29](https://github.com/nublson/quiver/pull/29) [`fa38c24`](https://github.com/nublson/quiver/commit/fa38c24965eaae67992d19b5ce6a1de090b4ae47) Thanks [@nublson](https://github.com/nublson)! - Add `quiver whoami`: reads `~/.quiver/credentials.json` and prints the authenticated GitHub username and linked Gist ID.

## 0.2.6

### Patch Changes

- [#27](https://github.com/nublson/quiver/pull/27) [`7db9f8e`](https://github.com/nublson/quiver/commit/7db9f8e078e881c5bfadf7422f59fb3926d7d114) Thanks [@nublson](https://github.com/nublson)! - UX polish across `push`, `remove` and `status`:
  - **Progress bars.** `push` and `remove` show listr2 progress, and `status` has a redesigned output: columns, a color-coded diff and a one-line summary.
  - **`remove` deletes from the right path.** Skills are now removed from `~/.agents/skills` as intended.
  - **`status` handles unusual lock files.** The local skills map is typed correctly, fixing crashes when the lock file had non-string values.

## 0.2.5

### Patch Changes

- [#25](https://github.com/nublson/quiver/pull/25) [`538450c`](https://github.com/nublson/quiver/commit/538450c07f8ea05c036c668846b3081dfdcda5aa) Thanks [@nublson](https://github.com/nublson)! - Faster `quiver sync`:
  - **Parallel installs.** Missing skills install concurrently, with listr2 progress per source and the lock file reconciled after each group.
  - **One install per repository.** Skills sharing a `sourceUrl` are batched into a single `npx skills add`, instead of one per skill.

## 0.2.4

### Patch Changes

- [`322e8a9`](https://github.com/nublson/quiver/commit/322e8a9d03ff0f1e190966d7e4b26ed5f4dca7eb) Thanks [@nublson](https://github.com/nublson)! - Update the `homepage` URL in `package.json` to the new site address. No CLI behavior changes.

## 0.2.3

### Patch Changes

- [#23](https://github.com/nublson/quiver/pull/23) [`9d38ff3`](https://github.com/nublson/quiver/commit/9d38ff3822da6a9812b841ef9c1dd08958c30ca0) Thanks [@nublson](https://github.com/nublson)! - Describe the package as "Keep your AI agent skills in sync across every device", and create a GitHub Release automatically after each publish.

## 0.2.2

### Patch Changes

- [#22](https://github.com/nublson/quiver/pull/22) [`8cbe897`](https://github.com/nublson/quiver/commit/8cbe897199afbdf4a5688b66197db9a9ffcd72cb) Thanks [@nublson](https://github.com/nublson)! - Sync fixes and short flags:
  - **Skills install under the right name.** `quiver sync` used the `skillPath` folder as the skill name instead of the lock file entry's key, so skills with nested paths could install under the wrong name.
  - **`-v` and `-h`** work as short flags for `--version` and `--help`.

## 0.2.1

### Patch Changes

- [#21](https://github.com/nublson/quiver/pull/21) [`f98f92e`](https://github.com/nublson/quiver/commit/f98f92eb16e0ca56dbb882240a0ffce997bfb8a5) Thanks [@nublson](https://github.com/nublson)! - `quiver login` uses GitHub's native device flow: it opens `github.com/login/device`, asks for the one-time code and stores the token in `~/.quiver/credentials.json`, with no server session.

## 0.2.0

### Minor Changes

- [`d950b58`](https://github.com/nublson/quiver/commit/d950b58d43423d247298cdbf6aeab215d895a9e0) Thanks [@nublson](https://github.com/nublson)! - Add `quiver status`: a diff of your local lock file against the remote Gist (local only, remote only, in sync), without changing anything.

## 0.1.0

### Minor Changes

- [`3618771`](https://github.com/nublson/quiver/commit/36187719cd25d93da77916734d98e0e06e4ace6a) Thanks [@nublson](https://github.com/nublson)! - First public release: the `login` → `push` → `sync` loop works end to end, with skills stored in a private GitHub Gist.
  - `quiver login`: GitHub device-flow auth, the token stored in `~/.quiver/credentials.json`.
  - `quiver push`: uploads `~/.agents/.skill-lock.json` to a private Gist.
  - `quiver sync`: fetches the remote lock and runs `npx skills add -g` for each skill missing locally.
  - `quiver remove <skill>`: removes a skill, repairs the lock file (working around a bug in `npx skills rm`) and pushes the update.
