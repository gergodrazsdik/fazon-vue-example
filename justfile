# fazon-vue-example repo tasks. `just` lists the recipes.
# On Windows, run recipes from Git Bash or WSL (they use sh).

import? 'local.just'

# List the recipes
default:
    @just --list --unsorted

# Check that the required tools are installed and print install hints
[group('meta')]
doctor:
    #!/bin/sh
    missing=0
    check() {
      if command -v "$1" >/dev/null 2>&1; then
        printf '  ok       %s\n' "$1"
      else
        printf '  MISSING  %-22s %s\n' "$1" "$2"
        missing=1
      fi
    }
    optional() {
      if command -v "$1" >/dev/null 2>&1; then
        printf '  ok       %s\n' "$1"
      else
        printf '  -        %-22s %s\n' "$1" "$2"
      fi
    }
    echo "Required:"
    check git                  "https://git-scm.com/downloads"
    check just                 "https://just.systems/man/en/packages.html"
    check lefthook             "https://lefthook.dev/installation/"
    check markdownlint-cli2    "npm install -g markdownlint-cli2"
    check yamllint             "pipx install yamllint (or uv tool install yamllint)"
    check actionlint           "https://github.com/rhysd/actionlint/blob/main/docs/install.md"
    check zizmor               "pipx install zizmor (or uv tool install zizmor), https://docs.zizmor.sh/installation/"
    check pinact               "https://github.com/suzuki-shunsuke/pinact#install"
    check typos                "cargo install typos-cli, or https://github.com/crate-ci/typos#install"
    check editorconfig-checker "https://github.com/editorconfig-checker/editorconfig-checker#installation"
    check shellcheck           "https://github.com/koalaman/shellcheck#installing"
    check gitleaks             "https://github.com/gitleaks/gitleaks#installing"
    check jq                   "https://jqlang.org/download/"
    check curl                 "https://curl.se/download.html"
    check node                 "Node.js 26: https://nodejs.org/ (the version in .node-version)"
    check pnpm                 "corepack enable (pnpm, the version in package.json's packageManager)"
    echo "Recommended:"
    optional gh                "https://cli.github.com/"
    optional claude            "https://code.claude.com/docs/en/setup"
    echo "Git hooks:"
    if [ -f "$(git rev-parse --git-path hooks)/commit-msg" ]; then
      echo "  ok       installed"
    else
      echo "  MISSING  git hooks              just hooks"
      missing=1
    fi
    exit "$missing"

# Which pinned linter versions have newer releases, and when each update is due (7-day cooldown); read-only
[group('meta')]
tool-updates:
    scripts/tool-updates.sh

# Install the git hooks (lefthook)
[group('dev')]
hooks:
    lefthook install

# Start Claude Code in this repo (extra arguments are passed through)
[group('dev')]
claude *args:
    claude {{ args }}

# Build the pinned framework commit, then install the dependencies from the lockfile (pnpm)
[group('dev')]
install:
    scripts/framework.sh
    pnpm install --frozen-lockfile

# Build the pinned framework commit into .fazon-framework/ (temporary, until git dependencies)
[group('dev')]
framework:
    scripts/framework.sh

# Regenerate the generated files, the entry file's exports and the token CSS (fazon sync)
[group('dev')]
sync:
    pnpm exec fazon sync

# Start Storybook's development server
[group('dev')]
storybook:
    pnpm run storybook

# Everything CI checks: the linters, the framework pins, sync --check, lint-code, types, tests, builds, package
[group('check')]
check: lint check-pins sync-check lint-code typecheck test build build-storybook package

# The framework's packages, workflow and image name one commit (ADAPTER-003)
[group('check')]
check-pins:
    scripts/check-framework-pin.sh

# The generated files are current (fazon sync --check)
[group('check')]
sync-check:
    pnpm exec fazon sync --check

# ESLint and Stylelint, with Fazon's rules
[group('check')]
lint-code:
    pnpm run lint

# Type-check (vue-tsc)
[group('check')]
typecheck:
    pnpm run typecheck

# The browser tests in Chromium: behaviour and contract tests (once: pnpm exec playwright install chromium)
[group('check')]
test:
    pnpm test

# Build the library (vite build, then the type declarations)
[group('check')]
build:
    pnpm run build

# Build the static Storybook
[group('check')]
build-storybook:
    pnpm run build-storybook

# Pack the library and check the package (publint)
[group('check')]
package:
    #!/bin/sh
    set -eu
    out=$(mktemp -d)
    trap 'rm -rf "$out"' EXIT
    pnpm pack --pack-destination "$out"
    pnpm exec publint run "$out"/*.tgz

# Run every linter (the lint workflow's lint job)
[group('lint')]
lint: lint-md lint-yaml lint-actions zizmor pinact-check lint-sh typos editorconfig gitleaks

# Lint Markdown (markdownlint-cli2)
[group('lint')]
lint-md:
    git ls-files -z '*.md' | xargs -0 scripts/with-tool.sh markdownlint-cli2

# Lint YAML (yamllint)
[group('lint')]
lint-yaml:
    scripts/with-tool.sh yamllint --strict .

# Lint GitHub Actions workflows (actionlint)
[group('lint')]
lint-actions:
    scripts/with-tool.sh actionlint

# Audit GitHub Actions workflows for security problems (zizmor, offline audits)
[group('lint')]
zizmor:
    scripts/with-tool.sh zizmor --offline --no-progress .github/workflows

# Check that every action is pinned to a full commit SHA (pinact)
[group('lint')]
pinact-check:
    scripts/with-tool.sh pinact run --check

# Lint shell scripts (shellcheck)
[group('lint')]
lint-sh:
    git ls-files -z '*.sh' | xargs -0 scripts/with-tool.sh shellcheck

# Check spelling (typos)
[group('lint')]
typos:
    scripts/with-tool.sh typos

# Check files against .editorconfig (editorconfig-checker)
[group('lint')]
editorconfig:
    git ls-files -z | xargs -0 scripts/with-tool.sh editorconfig-checker

# Scan the git history for secrets (gitleaks)
[group('lint')]
gitleaks:
    scripts/with-tool.sh gitleaks git --redact --no-banner

# Pin workflow actions to full commit SHAs (pinact)
[group('lint')]
pin:
    pinact run

# Apply the repository settings and rulesets to <owner/repo> (--no-required-checks on a new repo)
[group('maintainer')]
github-settings repo *flags:
    scripts/github-settings.sh {{ flags }} {{ repo }}

# Read the repository settings of <owner/repo> back and report differences
[group('maintainer')]
github-settings-check repo:
    scripts/github-settings.sh --check {{ repo }}
