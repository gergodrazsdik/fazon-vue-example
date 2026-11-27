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
    a11y:
      role: dialog
      name: part:Title
      describedBy: part:Description
      aria:
        aria-modal: "true"
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
    states: [default, hover, focus-visible]
    a11y:
      role: button
      name: prop:label
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
    initial: Content
states: [closed]
produce:
  closed:
    props: { open: false }
fixtures:
  confirm:
    props: { open: true }
    parts:
      Trigger:
        - slots: { default: Delete project }
      Overlay:
        - {}
      Content:
        - {}
      Title:
        - slots: { default: "Delete this project?" }
      Description:
        - slots: { default: "This can't be undone." }
      Body:
        - slots: { default: "All its components, specs and baselines are removed." }
      Footer:
        - slots:
            default:
              - { component: Button, props: { variant: secondary }, slots: { default: Cancel } }
              - { component: Button, props: { variant: primary }, slots: { default: Delete } }
      Close:
        - {}
  long-content:
    extends: confirm
    parts:
      Body:
        - slots:
            default:
              - p: Every component in the project is removed, together with its spec, stories, tests and screenshot baselines.
              - p: Pull requests that are still open keep their branches, but their checks will fail until the project is restored from a backup.
              - p: Members keep access to other projects. Their roles in this project are removed, and the audit log keeps a record of the deletion.
              - p: Integrations that publish this project's package stop at their next run.
matrix:
  axes: [size]
  fixtures: [confirm, long-content]
  exclude:
    - { state: closed, props: { size: sm } }
    - { state: closed, props: { size: lg } }
  include:
    - fixture: long-content
      props: { size: lg }
tokens:
  - part: Overlay
    use:
      background-color: color.overlay
  - part: Content
    use:
      background-color: color.surface.raised
      color: color.text.primary
  - part: Close
    when: { state: hover }
    use:
      background-color: color.surface.hover
  - part: Close
    when: { state: focus-visible }
    use:
      outline-color: color.focus.ring
exemptions:
  - check: layout
    rule: scroll
    part: Body
    fixture: long-content
    reason: The body scrolls inside the dialog by design when it is taller than the viewport.
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
