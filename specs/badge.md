---
# Every field: docs/spec/spec-format.md in the Fazon repository.
fazon: 0
name: Badge
tier: primitive
summary: Labels an item with a short status or category, such as New, Draft or Beta.
# The API (props, events, slots, methods, forward, form, parts) comes from `fazon propose` and
# `fazon approve`; states, a11y, fixtures, matrix and tokens build on it.
---

## Purpose

Labels an item with a short status or category, such as New, Draft or Beta, next to its title or in a table cell. Use Badge for a static label; for an action use Button, and for navigation use Link.

## Behaviour

- Comes in five tones, neutral, info, success, warning and danger, and two sizes, sm and md.
- Shows a short text label, with an optional icon before it.
- Not interactive: it takes no focus and responds to no pointer or keyboard input.
- A label longer than the available width wraps onto more lines; it is never clipped.

## Appearance

- Each tone is visibly different from the others, in both themes.
- Reads as smaller and quieter than a Button beside it.
- The icon is centred vertically on the label's first line.

## Content

- One to three words, in sentence case.

## Accessibility

- Its text is read inline with the surrounding content; it has no role of its own.
- The icon is decorative and hidden from assistive technology.

## Never

- Never used as a button or link. Use Button or Link.
- Never used for a notification count.
- Never holds a sentence; a badge is one to three words.
- Never relies on its tone alone to say what it means: the text says it.
