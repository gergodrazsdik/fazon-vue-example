# fazon-vue-example

The example component library of [Fazon](https://github.com/gergodrazsdik/fazon), a framework that lets a coding agent build UI components from written specs and verifies each one by rendering it, running deterministic checks and asking a vision model to judge what the checks cannot measure. This repository is Fazon's first consumer: a Vue 3 library that will grow to 17 components, each built from its spec and verified by Fazon's harness and CI workflow.

## Status

Milestone M1, the walking skeleton. This repository holds only its tooling so far: lint configuration, git hooks, the lint workflow and the repository settings script. The token set, the conventions doc, the first spec and a hand-written Button arrive next. There is nothing to install or use yet, and nothing is published to a package registry.

The framework's [design brief](https://github.com/gergodrazsdik/fazon/blob/main/docs/design/brief.md), [specs](https://github.com/gergodrazsdik/fazon/blob/main/docs/spec/README.md), [decision records](https://github.com/gergodrazsdik/fazon/blob/main/docs/adr/README.md) and [work tracker](https://github.com/gergodrazsdik/fazon/blob/main/docs/plan/TRACKER.md) cover this repository too.

## How it uses the framework

Until Fazon's first release (milestone M5), this repository pins one framework commit. Three references name it and move together, in one pull request: the CLI and Vue adapter as git dependencies, the reusable workflow, and the digest of the verifier image built from that commit. A CI check fails when they don't name the same commit ([consuming the framework before M5](https://github.com/gergodrazsdik/fazon/blob/main/docs/spec/adapter-boundary.md#consuming-the-framework-before-m5)).

## Contributing

This repository doesn't take outside pull requests yet; see [CONTRIBUTING.md](CONTRIBUTING.md). Issues and questions go to the [framework repository](https://github.com/gergodrazsdik/fazon/issues). Security problems: [SECURITY.md](SECURITY.md).

## License

[MIT-0](LICENSE): copy and change anything here without conditions, not even attribution. Third-party material keeps its own license: the Inter font and the Lucide icons, in [THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md).

Copyright 2026 Gergő Drazsdik
