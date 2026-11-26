---
# Every field: docs/spec/spec-format.md in the Fazon repository.
fazon: 0
name: Dialog
tier: composite
summary: Asks for a decision or shows focused content on top of the page.
uses: [Button]
# The API (props, events, slots, methods, forward, form, parts) comes from `fazon propose` and
# `fazon approve`; states, a11y, fixtures, matrix and tokens build on it.
a11y:
  keyboard:
    Escape: close the dialog
    Tab: focus the next focusable element in the dialog, wrapping at the end
    Shift+Tab: focus the previous focusable element in the dialog, wrapping at the start
  focus:
    trap: true
    restore: true
---

## Purpose

Asks for a decision, or shows content that needs the user's full attention, on top of the page.

## Behaviour

- It's opened and closed through a bound open state; an optional trigger, usually a Button, opens it.
- It shows a title, an optional description, a body, optional actions in a footer (usually Buttons, the primary action last) and an optional icon-only close button.
- Comes in three sizes: sm, md and lg.
- Opening moves focus into the dialog; closing returns it to the element that opened it.
- Escape, a click on the dimmed page behind it and the close button all close the dialog.
- The page behind doesn't scroll while the dialog is open.
- A body taller than the viewport scrolls inside the dialog; the title and actions stay in view.

## Appearance

- The dialog reads as clearly above the page; the page behind is dimmed but recognisable.

## Accessibility

- It's announced as a modal dialog, named by its title and described by its description.
- The close button's accessible name defaults to "Close".

## Never

- Never opened without a title.
- Never used for messages that don't need a response. Use a non-modal pattern.
