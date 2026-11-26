---
# Every field: docs/spec/spec-format.md in the Fazon repository.
fazon: 0
name: Badge
tier: primitive
summary: Labels an item with a short status or category, such as New, Draft or Beta.
props:
  tone:
    type: enum
    values: [neutral, info, success, warning, danger]
    default: neutral
    description: The tone. The label says what the badge means; the tone only reinforces it.
  size:
    type: enum
    values: [sm, md]
    default: md
slots:
  default:
    required: true
    description: "The label: one to three words, in sentence case."
  icon:
    description: A decorative icon before the label.
forward: root
# The API (props, events, slots, methods, forward, form, parts) comes from `fazon propose` and
# `fazon approve`; states, a11y, fixtures, matrix and tokens build on it.
fixtures:
  label:
    slots:
      default: New
  with-icon:
    extends: label
    slots:
      icon: { icon: check }
  long-label:
    slots:
      default: Waiting for review by the design team
    frame:
      width: 120
matrix:
  axes: [tone, size]
  fixtures: [label, with-icon, long-label]
tokens:
  - when: { props: { tone: neutral } }
    use:
      background-color: color.surface.subtle
      color: color.text.primary
      border-color: color.border.default
  - when: { props: { tone: info } }
    use:
      background-color: color.status.info.surface
      color: color.status.info.text
      border-color: color.status.info.border
  - when: { props: { tone: success } }
    use:
      background-color: color.status.success.surface
      color: color.status.success.text
      border-color: color.status.success.border
  - when: { props: { tone: warning } }
    use:
      background-color: color.status.warning.surface
      color: color.status.warning.text
      border-color: color.status.warning.border
  - when: { props: { tone: danger } }
    use:
      background-color: color.status.danger.surface
      color: color.status.danger.text
      border-color: color.status.danger.border
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
