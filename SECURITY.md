# Security policy

## Reporting a vulnerability

This repository is Fazon's example library. Please report vulnerabilities in it, as in the framework, through the framework repository's **GitHub private vulnerability reporting**: on [Fazon's](https://github.com/gergodrazsdik/fazon) **Security** tab, choose **Report a vulnerability** ([direct link](https://github.com/gergodrazsdik/fazon/security/advisories/new)). A private report on this repository's Security tab reaches the same maintainer. Do not open a public issue, pull request or discussion about it.

Include what you found, how to reproduce it, and the impact you expect.

## Scope

In scope:

- This repository's workflows, scripts and settings, for example a workflow that leaks secrets or can be triggered by an outside contributor.
- As they arrive: the library's components and its build, for example a component that injects untrusted content into the page.

Problems in the framework itself (the CLI and harness, the verifier image, the reusable workflow) are in scope of the [framework's security policy](https://github.com/gergodrazsdik/fazon/blob/main/SECURITY.md).

Out of scope:

- Vulnerabilities in dependencies that are already public and tracked upstream, unless this library uses them in an exploitable way.

## Supported versions

The library has no release yet. Only the latest `main` gets security fixes.

## Response

Fazon has a single maintainer, so responses are best effort. Fixed vulnerabilities are published as GitHub security advisories, with credit if you want it.
