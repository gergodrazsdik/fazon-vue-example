# fazon-vue-example

The example component library of [Fazon](https://github.com/gergodrazsdik/fazon), a framework that lets a coding agent build UI components from written specs and verifies each one by rendering it, running deterministic checks and asking a vision model to judge what the checks cannot measure. This repository is Fazon's first consumer: a Vue 3 library that will grow to 17 components, each built from its spec and verified by Fazon's harness and CI workflow.

## Status

Milestone M1, the walking skeleton. The library has its scaffold, its token set (light and dark themes) and [conventions](docs/conventions.md), and one component, Button: its [spec](specs/button.md), the stories and contract tests `fazon sync` generates from it, a hand-written implementation with behaviour tests, and its screenshot baselines in `baselines/`. `fazon verify` builds, lints, tests and packs the library and renders and checks every story in Fazon's verifier image, on a laptop and in CI, where Fazon's reusable workflow runs it and posts a summary on the pull request. Nothing is published to a package registry.

The framework's [design brief](https://github.com/gergodrazsdik/fazon/blob/main/docs/design/brief.md), [specs](https://github.com/gergodrazsdik/fazon/blob/main/docs/spec/README.md), [decision records](https://github.com/gergodrazsdik/fazon/blob/main/docs/adr/README.md) and [work tracker](https://github.com/gergodrazsdik/fazon/blob/main/docs/plan/TRACKER.md) cover this repository too.

## How it uses the framework

Until Fazon's first release (milestone M5), this repository pins one framework commit. Three references name it and move together, in one pull request: the CLI and Vue adapter packages, the reusable workflow, and the digest of the verifier image built from that commit. A CI check fails when they don't name the same commit ([consuming the framework before M5](https://github.com/gergodrazsdik/fazon/blob/main/docs/spec/adapter-boundary.md#consuming-the-framework-before-m5)). For now the packages are built from the pinned commit by `scripts/framework.sh`, not installed as git dependencies ([AGENTS.md](AGENTS.md#consuming-the-framework)).

## Working on it

You need Node.js 26, pnpm (`corepack enable`), git, [just](https://just.systems/) and curl; `just doctor` checks them and the linters. `fazon verify` also needs Podman or Docker, on a linux/amd64 machine.

```sh
just install                              # build the pinned framework, install the dependencies
pnpm exec playwright install chromium     # once: the browser the tests run in
just check                                # the checks on your machine
just verify                               # every check in the verifier image, as CI runs it
just storybook                            # browse the stories
```

After an intended change to how a component looks, `just verify` reports its stories as changed; read the diff images in the run's directory (`.fazon/runs/<run>/`), then `just baseline-update <component>` writes the new baselines from that run, to commit with the change.

The library's styles are two files: `fazon-vue-example/tokens.css` (the design tokens, as custom properties) and `fazon-vue-example/style.css` (the components and the Inter font). An app imports both, and sets `data-theme="dark"` on an element to switch that subtree to the dark theme.

## Contributing

This repository doesn't take outside pull requests yet; see [CONTRIBUTING.md](CONTRIBUTING.md). Issues and questions go to the [framework repository](https://github.com/gergodrazsdik/fazon/issues). Security problems: [SECURITY.md](SECURITY.md).

## License

[MIT-0](LICENSE): copy and change anything here without conditions, not even attribution. Third-party material keeps its own license: the Inter font and the Lucide icons, in [THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md).

Copyright 2026 Gergő Drazsdik
