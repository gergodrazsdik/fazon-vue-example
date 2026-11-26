---
# A primitive: one element, no parts.
fazon: 0
name: Button
tier: primitive
summary: Triggers an action on the current page.
props:
  variant:
    type: enum
    values: [primary, secondary, ghost]
    default: primary
    description: Visual emphasis. Primary is the main action of a view.
  size:
    type: enum
    values: [sm, md, lg]
    default: md
  disabled:
    type: boolean
    default: false
  loading:
    type: boolean
    default: false
    description: Shows a spinner in place of the icon and blocks activation.
  type:
    type: enum
    values: [button, submit, reset]
    default: button
    description: The native button type, for use inside a form.
events:
  click:
    description: Activation by pointer or keyboard. Not emitted while disabled or loading.
slots:
  default:
    required: true
    description: The label.
  icon:
    description: An icon before the label.
methods:
  focus:
    description: Moves focus to the button.
forward: root
states: [default, hover, focus-visible, active, disabled, loading]
a11y:
  role: button
  name: content
  keyboard:
    Enter: activate
    Space: activate
  aria:
    aria-busy: "true while loading"
    aria-disabled: "true while loading, so the button keeps its focus"
fixtures:
  label:
    slots:
      default: Save changes
  with-icon:
    extends: label
    slots:
      icon: { icon: check }
  long-label:
    slots:
      default: Save changes and notify every member of the workspace
    frame:
      width: 160
matrix:
  axes: [variant, size]
  fixtures: [label, with-icon, long-label]
  include:
    - props: { variant: ghost, size: lg }
      state: hover
tokens:
  - when: { props: { variant: primary } }
    use:
      background-color: color.action.primary
      color: color.text.on-action
  - when: { props: { variant: primary }, state: hover }
    use:
      background-color: color.action.primary-hover
  - when: { props: { variant: secondary } }
    use:
      background-color: color.surface.raised
      border-color: color.border.default
      color: color.text.primary
  - when: { props: { variant: ghost } }
    use:
      color: color.text.action
  - when: { state: focus-visible }
    use:
      outline-color: color.focus.ring
judge:
  - id: loading-spinner
    question: Does the spinner take the icon's place without moving the label?
    select:
      when: { state: loading }
extensions:
  angular:
    reason: Native button semantics on the host element, as Angular libraries usually do
    options:
      selector: "button[fzButton]"
  web-components:
    omit:
      methods.focus:
        reason: HTMLElement.focus() already does this; the element delegates focus to its inner button
---

## Purpose

Triggers an action on the current page, such as saving a form or opening a dialog.

## Behaviour

- Loading shows a spinner in place of the icon, keeps the label and blocks activation. The button stays focusable.
- Disabled blocks activation and removes the button from the tab order.
- A label longer than the available width wraps onto more lines; it is never clipped.

## Appearance

- Primary reads as more prominent than secondary, and secondary more than ghost.
- Every state is visibly different from default.

## Never

- Never used for navigation. Use Link.
- Never more than one primary button in a view.
