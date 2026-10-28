#!/usr/bin/env bash
# Writes a changeset for each change in BEFORE..AFTER to what ships in the
# usequiver package, unless the change brought its own changeset. Ported from
# nublson/notionic's auto-changeset.sh.
#
# Walks develop's first-parent history, so each step is one landed change:
# - a merge commit, `Merge pull request #12 from …`, whose body's first line is
#   the PR's conventional title, e.g. `feat(cli): add whoami command`;
# - a squash merge, `feat(cli): add whoami command (#12)`;
# - or a direct push, whose subject is the title.
# The title becomes the changelog line, with the PR, commit and author recorded
# for @changesets/changelog-github.
#
# Bump: `type!:` → major (minor before 1.0), `feat:` → minor, else patch.
#
# Env: BEFORE, AFTER, REPO (owner/name). GH_TOKEN for author lookups (optional).
# Prints the number of changesets written as `count=N` to $GITHUB_OUTPUT.
set -euo pipefail

PACKAGE=usequiver
PACKAGE_JSON=packages/cli/package.json
# What ships in the package: its source and bin, not tests.
PATHS=(
  'packages/cli/src/'
  'packages/cli/bin/'
  ':(exclude)packages/cli/src/**/*.test.ts'
)

count=0
output() { [ -n "${GITHUB_OUTPUT:-}" ] && echo "count=$count" >> "$GITHUB_OUTPUT" || true; }

# `before` is all zeros on a branch's first push: nothing to diff against.
if [ "$BEFORE" = "0000000000000000000000000000000000000000" ]; then
  output; exit 0
fi

MAJOR=$(jq -r .version "$PACKAGE_JSON" | cut -d. -f1)

# If $BEFORE is unreachable (history rewritten), fail safe to "nothing changed".
COMMITS=$(git rev-list --reverse --first-parent "$BEFORE..$AFTER" 2>/dev/null || true)

for SHA in $COMMITS; do
  # What this step changed on develop: against its first parent, so a merge
  # commit counts everything its pull request brought.
  if [ -z "$(git diff --name-only "$SHA^1" "$SHA" -- "${PATHS[@]}")" ]; then
    continue
  fi

  # The change wrote its own changeset: keep it as the entry.
  if git diff --name-only --diff-filter=A "$SHA^1" "$SHA" -- .changeset/ \
    | grep -v '/README.md$' | grep -q '\.md$'; then
    echo "${SHA:0:7}: has its own changeset."
    continue
  fi

  SUBJECT=$(git log -1 --format=%s "$SHA")
  PR=$(printf '%s' "$SUBJECT" | sed -nE 's/^Merge pull request #([0-9]+) from .*/\1/p')
  if [ -n "$PR" ]; then
    TITLE=$(git log -1 --format=%b "$SHA" | sed -n '/./{p;q;}')
    TITLE=${TITLE:-$SUBJECT}
  else
    PR=$(printf '%s' "$SUBJECT" | sed -nE 's/.*\(#([0-9]+)\)$/\1/p')
    TITLE=$SUBJECT
  fi

  if printf '%s' "$TITLE" | grep -qE '^[a-z]+(\([^)]*\))?!:'; then
    BUMP=major
  elif printf '%s' "$TITLE" | grep -qE '^feat(\([^)]*\))?:'; then
    BUMP=minor
  else
    BUMP=patch
  fi
  # Before 1.0, a breaking change is a minor bump (0.1.0 → 0.2.0).
  if [ "$BUMP" = major ] && [ "$MAJOR" = 0 ]; then BUMP=minor; fi

  # `feat(cli)!: add whoami (#12)` → "Add whoami".
  DESCRIPTION=$(printf '%s' "$TITLE" | sed -E 's/^[a-z]+(\([^)]*\))?!?: *//; s/ *\(#[0-9]+\)$//')
  DESCRIPTION="$(printf '%s' "${DESCRIPTION:0:1}" | tr '[:lower:]' '[:upper:]')${DESCRIPTION:1}"

  AUTHOR=""
  if [ -n "${GH_TOKEN:-}" ]; then
    if [ -n "$PR" ]; then
      AUTHOR=$(gh api "repos/${REPO}/pulls/${PR}" --jq '.user.login // ""' 2>/dev/null || true)
    else
      AUTHOR=$(gh api "repos/${REPO}/commits/${SHA}" --jq '.author.login // ""' 2>/dev/null || true)
    fi
  fi

  SLUG=$(printf '%s' "$DESCRIPTION" | tr '[:upper:]' '[:lower:]' | tr -cs 'a-z0-9' '-' | sed 's/^-//; s/-$//' | cut -c1-40)
  FILE=".changeset/${SLUG:-change}-${SHA:0:7}.md"
  {
    printf -- '---\n"%s": %s\n---\n\n' "$PACKAGE" "$BUMP"
    [ -n "$PR" ] && printf 'pr: #%s\n' "$PR"
    printf 'commit: %s\n' "$SHA"
    [ -n "$AUTHOR" ] && printf 'author: @%s\n' "$AUTHOR"
    printf '\n%s\n' "$DESCRIPTION"
  } > "$FILE"
  echo "${SHA:0:7}: $BUMP, $FILE"
  count=$((count + 1))
done

output
