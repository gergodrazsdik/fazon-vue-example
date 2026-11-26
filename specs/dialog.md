---
# Every field: docs/spec/spec-format.md in the Fazon repository.
fazon: 0
name: Dialog
tier: composite
summary: Asks for a decision or shows focused content on top of the page.
uses: [Button]
props:
  open:
    type: boolean
    model: true
    default: false
    description: Whether the dialog is open. Escape, a click on the dimmed page and the close button set it to false.
  size:
    type: enum
    values: [sm, md, lg]
    default: md
    description: The size of the dialog.
slots:
  default:
    required: true
    description: The Overlay and Content parts, and optionally the Trigger part.
forward: Content
parts:
  Trigger:
    parent: Dialog
    count: optional
    description: The button that opens the dialog and receives focus again when it closes.
    slots:
      default:
        required: true
        description: The trigger's label, or with asChild a single Button that acts as the trigger.
  Overlay:
    parent: Dialog
    count: one
    portal: true
    description: Dims the page behind the dialog. A click on it closes the dialog.
  Content:
    parent: Dialog
    count: one
    portal: true
    description: The dialog's surface, shown over the dimmed page while open.
    slots:
      default:
        required: true
        description: The Title and Body parts, and optionally the Description, Footer and Close parts.
  Title:
    parent: Content
    count: one
    description: The title, which names the dialog. It stays in view while the body scrolls.
    slots:
      default:
        required: true
        description: The title text.
  Description:
    parent: Content
    count: optional
    description: Text that describes the dialog.
    slots:
      default:
        required: true
        description: The description text.
  Body:
    parent: Content
    count: one
    description: The main content. It scrolls inside the dialog when taller than the space available.
    slots:
      default:
        required: true
        description: The body content.
  Footer:
    parent: Content
    count: optional
    description: The actions, kept in view while the body scrolls.
    slots:
      default:
        required: true
        description: The actions, usually Buttons, with the primary action last.
  Close:
    parent: Content
    count: optional
    description: The icon-only button that closes the dialog. It shows a built-in, decorative close icon.
    props:
      label:
        type: string
        default: Close
        description: The button's accessible name.
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
extensions:
  vue:
    reason: A Button used as the trigger must be the trigger element itself; without asChild it would be a button nested inside a button.
    add:
      parts.Trigger.props.asChild:
        type: boolean
        default: false
        description: Makes the slot's single child the trigger, instead of rendering a button around it.
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
