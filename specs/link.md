---
# Every field: docs/spec/spec-format.md in the Fazon repository.
fazon: 0
name: Link
tier: primitive
summary: Navigates to another page or to a place on the current page.
# The API (props, events, slots, methods, forward, form, parts) comes from `fazon propose` and
# `fazon approve`; states, a11y, fixtures, matrix and tokens build on it.
states: [default, hover, focus-visible, active]
a11y:
  role: link
  name: content
  keyboard:
    Enter: activate
---

## Purpose

Navigates to another page, or to a place on the current page. Use Link wherever activating it changes the location; for an action on the current page use Button.

## Behaviour

- Comes in three variants: default, in the action colour; subtle, in the surrounding text's colour, for dense lists and footers; and standalone, for a link on its own line.
- Renders a native link with a destination; the app's router handles it like any link.
- An external link opens in a new tab and shows an icon after its text.
- Activates with a pointer click or Enter, and shows a focus ring when focused from the keyboard.
- A label longer than the available width wraps onto more lines, as text does; it is never clipped.

## Appearance

- Default and subtle links are always underlined; a standalone link shows its underline on hover and focus.
- A visited link looks the same as one not yet visited.
- Hover and active are visibly different from default.

## Content

- The text says where the link goes, read on its own.

## Accessibility

- An external link tells assistive technology that it opens in a new tab.
- The external icon is decorative and hidden from assistive technology.

## Never

- Never used for an action on the current page. Use Button.
- Never rendered without a destination; show plain text instead.
- Never told apart from text by colour alone: the default and subtle links are underlined.
- Never labelled "click here" or "more": the text says where it goes.
