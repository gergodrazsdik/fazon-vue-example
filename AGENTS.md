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

**Current phase: M1, the walking skeleton** (the framework's tracker, T-0046). This repo holds its tooling only. Next come the scaffold, the token set and the conventions doc (moved from the framework's `docs/spec/example-library/`), the Button spec and a hand-written Button, the three framework pins with their check, and the CI workflow.

## Layout

```text
AGENTS.md CLAUDE.md README.md LICENSE THIRD-PARTY-NOTICES.md
CONTRIBUTING.md CODE_OF_CONDUCT.md SECURITY.md SUPPORT.md
justfile  local.just.example  lefthook.yml  .editorconfig  lint configs
.claude/settings.json    committed Claude Code sandbox and deny rules
.github/                 workflows/lint.yml, rulesets/, the PR template, CODEOWNERS, dependabot.yml
scripts/                 with-tool.sh, check-commit-msg.sh, github-settings.sh, install-ci-tools.sh, tool-updates.sh
```

Directories arrive with the work that first needs them. Keep this tree current when you add top-level folders.

## Consuming the framework

Until M5 this repo pins **one framework commit**. The CLI and Vue adapter (git dependencies), the reusable workflow reference and the verifier image digest in `fazon.yaml` name the same commit and move together, in one pull request; a CI check fails when they don't ([consuming the framework before M5](https://github.com/gergodrazsdik/fazon/blob/main/docs/spec/adapter-boundary.md#consuming-the-framework-before-m5)). A change the library needs from the framework is made in the framework repository first, then the pin moves.

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
- Files Fazon writes into this repo carry no license header or copyright line ([license terms](https://github.com/gergodrazsdik/fazon/blob/main/docs/spec/licensing.md)). The scripts in `scripts/`, copied from the framework, carry `SPDX-License-Identifier: MIT-0`.

## Commands

Use `just` (`just --list`):

| Recipe | What it does |
|---|---|
| `just doctor` | Check the tools; prints install hints. |
| `just hooks` | Install the lefthook git hooks. |
| `just lint` | Every linter the `lint` workflow runs: Markdown, YAML, actionlint, zizmor, pinact, shellcheck, typos, EditorConfig, gitleaks. |
| `just pin` | Pin workflow actions to full commit SHAs. |
| `just tool-updates` | Which linter versions pinned outside Dependabot's reach have newer releases, and when each is due (7-day cooldown). Read-only. |
| `just claude` | Start Claude Code in this repo. |
| `just github-settings <repo>` / `just github-settings-check <repo>` | Maintainer only. Apply or check the repository settings and rulesets. |

Run `just lint` before every commit. The hooks run the same checks on staged files plus gitleaks and the Conventional Commits header. `build`, `test` and `verify` arrive with the code.

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
