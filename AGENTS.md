# Agent instructions: fazon-vue-example

These instructions are for coding agents (Claude Code, Codex and others) working in this repo. Humans: see [README.md](README.md) and [CONTRIBUTING.md](CONTRIBUTING.md).

## What this repo is

The example component library of [Fazon](https://github.com/gergodrazsdik/fazon): a Vue 3 library that will hold 17 components, each built from a written spec and verified by Fazon's harness, its verifier image and its reusable CI workflow. It is the framework's first consumer, and the proof that the framework works on a real library. It is licensed under MIT-0 so that others can copy it as a template.

Where the truth lives, all in the framework repository:

- [docs/design/brief.md](https://github.com/gergodrazsdik/fazon/blob/main/docs/design/brief.md): scope, architecture and milestones.
- [docs/adr/](https://github.com/gergodrazsdik/fazon/blob/main/docs/adr/README.md): decisions that refine or supersede the brief.
- [docs/spec/](https://github.com/gergodrazsdik/fazon/blob/main/docs/spec/README.md): the specs, including the [license terms](https://github.com/gergodrazsdik/fazon/blob/main/docs/spec/licensing.md) and the [adapter boundary](https://github.com/gergodrazsdik/fazon/blob/main/docs/spec/adapter-boundary.md).
- [docs/plan/TRACKER.md](https://github.com/gergodrazsdik/fazon/blob/main/docs/plan/TRACKER.md): the single tracker, for this repo's work too.

If any of them conflicts with these instructions or a request, stop and raise it with the maintainer; don't pick a side yourself.

**Current phase: M2, the loop** (the framework's tracker, T-0050 step 8): Badge, Link and Dialog are specified, proposed, approved and generated from their specs, and Button regenerated the same way. The repo has the library's scaffold (what `fazon init` will write), the token set and the conventions doc, the Button spec with a hand-written Button and its baselines, the framework pins with their check, and the `ci` workflow, which runs the library's checks and `fazon verify` through the framework's reusable workflow.

## Layout

```text
AGENTS.md CLAUDE.md README.md LICENSE THIRD-PARTY-NOTICES.md
CONTRIBUTING.md CODE_OF_CONDUCT.md SECURITY.md SUPPORT.md
justfile  local.just.example  lefthook.yml  .editorconfig  lint configs
fazon.yaml               Fazon's configuration: the adapter, the verifier image by digest, the token prefix `fz`
baselines/               the stories' screenshot baselines, fazon.json (the image that made them) and NOTICE.md: `fazon baseline update` only
package.json  pnpm-workspace.yaml  pnpm-lock.yaml  .node-version
tsconfig.json  tsconfig.build.json  vite.config.ts  vitest.config.ts  eslint.config.js  stylelint.config.js
.storybook/              Storybook: main.ts, preview.ts, vitest.setup.ts; generated/themes.ts (fazon sync)
specs/                   the component specs (button.md)
src/                     index.ts (the package entry), style.css (loads Inter), tokens.css (fazon sync)
src/components/<name>/   a component: <Component>.vue, <Component>.test.ts; generated/ (fazon sync)
tokens/                  the token set: tokens.resolver.json, raw.json, roles.json, themes/, README.md
docs/conventions.md      the conventions doc
.claude/settings.json    committed Claude Code sandbox and deny rules
.github/                 workflows/ (lint.yml, ci.yml), rulesets/, the PR template, CODEOWNERS, dependabot.yml
scripts/                 with-tool.sh, check-commit-msg.sh, github-settings.sh, install-ci-tools.sh, tool-updates.sh, framework.sh, check-framework-pin.sh, seeded-failures.sh
```

`generated/`, `src/tokens.css`, `.storybook/generated/` and the exports between the `fazon:exports` markers in `src/index.ts` belong to `fazon sync`: never edit them by hand. Change the spec or the token set and run `just sync`. `baselines/` belongs to `fazon baseline update`: never edit, add or remove a baseline by hand.

Directories arrive with the work that first needs them. Keep this tree current when you add top-level folders.

## Consuming the framework

Until M5 this repo pins **one framework commit**. The CLI and Vue adapter, the reusable workflow reference and the verifier image digest in `fazon.yaml` name the same commit and move together, in one pull request; `scripts/check-framework-pin.sh` (`just check-pins`, the `ci` workflow's `framework-pin` job) fails when they don't ([consuming the framework before M5](https://github.com/gergodrazsdik/fazon/blob/main/docs/spec/adapter-boundary.md#consuming-the-framework-before-m5)). A change the library needs from the framework is made in the framework repository first, then the pin moves.

**For now, not git dependencies.** The framework's packages don't install as pnpm git dependencies yet: their `workspace:*` dependencies on each other don't resolve outside the framework's workspace, and nothing builds their `dist/` on install. Until they do, `scripts/framework.sh` (`just framework`, part of `just install`) fetches the pinned commit into `.fazon-framework/<sha>/` (gitignored) and builds it, and `package.json` and the overrides in `pnpm-workspace.yaml` depend on it as `file:.fazon-framework/<sha>/packages/<name>`. The commit is the SHA in those paths.

To move the pin: replace the SHA in `package.json` and `pnpm-workspace.yaml`, set `image` in `fazon.yaml` to the digest of `ghcr.io/gergodrazsdik/fazon-verifier:sha-<sha>` (`crane digest` or `skopeo inspect` give it), run `just install` and `just sync`, and commit the lockfile and any regenerated files with it.

## Working agreement

- This repo was bootstrapped with one commit on `main`. From then on, work on feature branches (`feat/…`, `fix/…`, `docs/…`, `ci/…`, `chore/…`). **Never commit to `main`.**
- Push branches and open pull requests with `gh`. The description follows the PR template: summary, the framework's tracker IDs, checks run. It becomes the commit body when the maintainer squash-merges, so keep it clean.
- **Never merge a pull request, never enable auto-merge on one, and never create, move or delete a tag.** The maintainer does those.
- Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`, `ci:`, `build:`, `test:`…) for commits and pull request titles; a squash merge uses the title as the commit header. Small, logical commits.
- Write commit messages to a file outside the repo and commit with `git commit -F <file>`. Signing is welcome; if your git config signs, keep it on.
- Never bypass a hook (`--no-verify`), never weaken or skip a check, and never relax a lint rule to get a change through. Fix the cause, or raise it.
- Ask before any GitHub write other than pushing your branch and creating or editing your pull requests: comments, reviews, closing, labels, settings, force pushes outside your own stack.
- Stacked pull requests use the `gh stack` extension, as the framework's [AGENTS.md](https://github.com/gergodrazsdik/fazon/blob/main/AGENTS.md#stacked-prs) describes. Never run `gh stack merge`.

## Contributions and licensing

- **No outside contributions** before the publishing decision: no outside pull requests, no contributor agreement, no CLA assistant. Issues are off here; they go to the framework repository ([CONTRIBUTING.md](CONTRIBUTING.md)).
- Everything here is **MIT-0** ([LICENSE](LICENSE)). Third-party material keeps its license and its notice in [THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md); add an entry before adding such material, and only material whose license allows it.
- No file in this repo carries a license header or copyright line, whether a person or Fazon wrote it: the MIT-0 `LICENSE` covers the repository ([license terms](https://github.com/gergodrazsdik/fazon/blob/main/docs/spec/licensing.md), [ADR 0021](https://github.com/gergodrazsdik/fazon/blob/main/docs/adr/0021-settled-questions.md)).

## Commands

Use `just` (`just --list`):

| Recipe | What it does |
|---|---|
| `just doctor` | Check the tools; prints install hints. |
| `just hooks` | Install the lefthook git hooks. |
| `just install` | Build the pinned framework commit, then install the dependencies from the lockfile (pnpm). |
| `just sync` | `fazon sync`: regenerate the components' `generated/` files, the entry's exports, `src/tokens.css` and the Storybook themes. |
| `just check` | Everything CI checks: `lint`, then `check-pins`, `sync-check`, `lint-code`, `typecheck`, `test`, `build`, `build-storybook` and `package`. |
| `just check-pins` | The framework's packages, workflow and image name one commit (ADAPTER-003). |
| `just sync-check` | `fazon sync --check`: the generated files are current. |
| `just lint-code` | ESLint and Stylelint with Fazon's rules: the token rules, no inline suppressions. |
| `just typecheck` / `just test` | `vue-tsc --noEmit`; the browser tests (behaviour and contract tests) in Chromium (install it once: `pnpm exec playwright install chromium`). |
| `just build` / `just build-storybook` / `just package` | The library build (`dist/`, with the type declarations); the static Storybook; `pnpm pack` checked with publint. |
| `just verify` | `fazon verify --no-judge`: every check (build, lint, test, package, a11y, tokens, layout, visual) in the verifier image, with Podman or Docker on linux/amd64; the run's record, captures and diff images go to `.fazon/runs/<run>/`. The `ci` workflow runs it too, through the framework's reusable `verify.yml`, and posts its summary on the pull request. |
| `just baseline-update <component>…` / `--all` | `fazon baseline update`: write the baselines from the latest verify run that passed every check other than `visual`. Only after an intended change to the component's look, which the diff images show. |
| `just seeded-failures [<case>…]` | One defect per check, each in a throwaway copy under `.fazon/seeded/`, must fail `fazon verify` with its rule (about a minute per case). |
| `just storybook` | Storybook's development server. |
| `just lint` | Every linter the `lint` workflow runs: Markdown, YAML, actionlint, zizmor, pinact, shellcheck, typos, EditorConfig, gitleaks. |
| `just pin` | Pin workflow actions to full commit SHAs. |
| `just tool-updates` | Which linter versions pinned outside Dependabot's reach have newer releases, and when each is due (7-day cooldown). Read-only. |
| `just claude` | Start Claude Code in this repo, with the pinned framework's plugin and its skills (`--plugin-dir .fazon-framework/<sha>/plugin`) once `just install` has built it. |
| `just github-settings <repo>` / `just github-settings-check <repo>` | Maintainer only. Apply or check the repository settings and rulesets. |

Run `just check` before every commit (`just lint` alone when no code changed), and `just verify` before pushing a change to the library. The hooks run the linters on staged files plus gitleaks and the Conventional Commits header.

## Design principles

From the framework's brief; every spec and every line of code here follows them.

- **Deterministic checks before the judge.** Anything measurable is checked by a deterministic tool. The vision model judges only what cannot be measured.
- **A person at three decision points:** the component's API before code is written, the local review of the result, and the pull request. Nothing automates them away.
- **The harness owns the loop.** The agent only edits the files it is allowed to; the harness decides what runs next, enforces the caps and records every step. A check is never relaxed to get a run through; only an explicit exemption in the spec waives one.
- **Nothing machine-specific in committed files:** no absolute paths, hostnames, usernames, secret-manager entries or credentials.

## Work tracker and decisions

This repo has no tracker of its own. Its work is tracked in the [framework's tracker](https://github.com/gergodrazsdik/fazon/blob/main/docs/plan/TRACKER.md): a pull request here names the tracker IDs it works on, and the tracker is updated in a framework pull request. Findings and questions go there too, under the framework's ID rules. Decisions are ADRs in the framework repository. Don't guess on scope, behaviour or licensing: record a question there and ask the maintainer.

## Local overrides

`local.just`, `lefthook-local.yml`, `CLAUDE.local.md`, `.claude/settings.local.json`, `.env.local` and `fazon.local.yaml` are personal and gitignored. Never commit them, and never put machine-specific paths, tools or secret-manager commands into committed files.

## Writing style

Precise, concise, plain English. No marketing language. Docs say what something does and when to use it. Specs say what must hold, in testable terms.
