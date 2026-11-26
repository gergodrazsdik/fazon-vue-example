#!/bin/sh
# Builds the pinned framework commit into .fazon-framework/<sha>/ (gitignored), where
# package.json's file: dependencies on `fazon`, `@fazon/core` and `@fazon/adapter-vue` point.
# Run it before `pnpm install` (`just install` does both).
#
# TEMPORARY: the framework's packages don't install as pnpm git dependencies yet (their
# `workspace:*` dependencies don't resolve outside the framework's workspace, and nothing builds
# their dist/ on install). Once they do, the dependencies become
# `github:gergodrazsdik/fazon#<sha>&path:packages/<name>` and this script goes.
#
# Usage: scripts/framework.sh
set -eu

root=$(cd "$(dirname "$0")/.." && pwd)
cd "$root"

# The commit, from the CLI's dependency: file:.fazon-framework/<sha>/packages/cli
# shellcheck disable=SC2016  # JavaScript, not shell: its template literal is meant for node
sha=$(node -e '
  const spec = require("./package.json").devDependencies?.fazon ?? "";
  const match = /^file:\.fazon-framework\/([0-9a-f]{40})\/packages\/cli$/.exec(spec);
  if (!match) { console.error(`package.json: unexpected spec for fazon: "${spec}"`); process.exit(1); }
  console.log(match[1]);
')
target=".fazon-framework/$sha"

if [ -f "$target/.fazon-built" ]; then
  echo "The framework at $sha is built in $target."
  exit 0
fi

work="$target.partial"
rm -rf "$work"
mkdir -p "$work"
echo "Fetching the framework at $sha..."
git -C "$work" init --quiet
git -C "$work" fetch --quiet --depth 1 https://github.com/gergodrazsdik/fazon.git "$sha"
git -C "$work" -c advice.detachedHead=false checkout --quiet FETCH_HEAD

echo "Installing and building the framework's packages..."
(cd "$work" && pnpm install --frozen-lockfile && pnpm run build)

rm -rf "$target"
mv "$work" "$target"
touch "$target/.fazon-built"
echo "The framework at $sha is built in $target."
