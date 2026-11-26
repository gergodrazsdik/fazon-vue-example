# Conventions

The rules that span the components of `fazon-vue-example`. The agent reads this file on every run, together with the component's spec and the role tokens; a reviewer reads it to judge whether a component fits the library.

Each rule says how it's kept:

- **Enforced:** a check fails a component that breaks it, and names the check.
- **Guidance:** no check measures it. The agent follows it, and the judge's `family` question and the reviewer look for it.

A conflict between this file and a component's spec is settled by the spec.

## Files

| Rule | Kept by |
|---|---|
| A component lives in `src/components/<name>/`, where `<name>` is the spec's kebab-case name. | Enforced: the harness (PERM-002) |
| The component is `<Component>.vue`; each part is `<Component><Part>.vue` (`Tabs.vue`, `TabsTrigger.vue`). Helpers are `*.ts` in the same directory, and behaviour tests are `<Component>.test.ts`. | Enforced: the adapter's file patterns (PERM-003) and the `test` check (`missing-behaviour`) |
| Behaviour tests render the component with `render` from `vitest-browser-vue` (pinned at 3.1.0 in `package.json`) and query it through the returned screen, in Vitest's browser mode. | Guidance |
| Styles live in the single-file component's `<style scoped>` block. A part shared by several files may use a `*.css` file in the directory. | Guidance |
| `generated/` belongs to the harness: story files, contract tests, the story manifest, provenance. | Enforced: the harness (PERM-002) and the `build` check (`generated`) |
| Code shared between components, and new dependencies, need a person: the run stops and says so. | Enforced: the harness |

## Names

The spec fixes the API; the adapter maps it to Vue ([API mapping](https://github.com/gergodrazsdik/fazon/blob/main/docs/spec/adapter-boundary.md#api-mapping)).

| Rule | Kept by |
|---|---|
| Props, events, slots and methods are camelCase; enum values and states are kebab-case. | Enforced: `spec check` (SPEC-001) |
| Every component and part file declares its Vue name: the spec's name with the prefix `Fz`, set with `defineOptions({ name })`. `Button.vue` declares `FzButton`, and a part takes the prefix too: `TabsTrigger.vue` declares `FzTabsTrigger`. So a name is never a single word that an HTML element such as `button` could clash with. The file, the export and the spec keep the spec's name. | Enforced: `lint` (eslint-plugin-vue's `vue/multi-word-component-names`) |
| A boolean prop is named for the state it turns on, without `is` or `has`: `disabled`, `loading`, `open`. | Guidance |
| A prop with a default in the spec declares it with `withDefaults`, a boolean's `false` too: vue-component-meta reads no default otherwise. | Enforced: `test` (`contract-api`) |
| Visual emphasis is a `variant` enum. Size is a `size` enum of `sm`, `md` and `lg`, with `md` the default. | Guidance |
| An event is named for what happened, without `on`: `click`, `dismiss`, `select`. The value of a model is announced by `v-model`, not by a separate event. | Guidance |
| A slot for the main content is `default`. A slot for an icon before the content is `icon`; after it, `iconEnd`. | Guidance |

## Parts and states

| Rule | Kept by |
|---|---|
| The root element carries `data-part="<Component>"` and each part's root element `data-part="<Part>"`, with the names as the spec writes them. | Enforced: the verifier (MATRIX-004) |
| Every state that isn't a pseudo-state is reflected while it holds: the element carries `data-<state>`, such as `data-selected` or `data-disabled`, with no value. | Enforced: the verifier (MATRIX-005) |
| Styles select states through these attributes or through pseudo-classes (`:hover`, `:focus-visible`, `:active`), never through a class added for the state. | Guidance |
| Attributes a headless primitive sets, such as Reka UI's `data-state`, stay as they are; the component adds its own `data-<state>` beside them. | Guidance |

## Styling

Plain CSS with custom properties, scoped per component. The tokens are built into `src/tokens.css` with the prefix `fz` ([token set](https://github.com/gergodrazsdik/fazon/blob/main/docs/spec/tokens.md)).

| Rule | Kept by |
|---|---|
| Every [token-bound property](https://github.com/gergodrazsdik/fazon/blob/main/docs/spec/check-catalogue.md#token-bound-properties) takes a role token, `var(--fz-…)`, or an allowed value such as `0`, `none` or `currentColor`. Never a literal, never a raw token. | Enforced: `lint` (`raw-value`, `raw-token`, `unknown-token`) and `tokens` |
| A spec's token rules say which role token a variant or state uses for the properties that give it its identity; the component uses exactly those. | Enforced: `tokens` (`token-rule`) |
| A value used in more than one place is a component-local custom property, named `--_<name>` and set from a role token: `--_padding-inline: var(--fz-space-inset-md)`. | Guidance; its value is enforced like any other |
| The browser's own styles are reset where they would show: a button's padding, border and font, a list's margin. | Enforced: `tokens` (`user-agent`) |
| No `!important`, no `z-index` above what the headless primitive manages, no styles outside the component's scope (`:global`, `:deep`). | Guidance |
| No inline suppressions. A check is waived only by an exemption in the spec. | Enforced: `lint` (`inline-suppression`) |

### Variants and sizes

- `primary`: `color.action.primary` with `color.text.on-action`; hover and active take the `-hover` and `-active` roles.
- `secondary`: `color.surface.raised` with `color.border.default` and `color.text.primary`; hover takes `color.surface.hover`, active `color.surface.active`.
- `ghost`: no background or border, `color.text.action`; hover takes `color.surface.hover`.
- Status variants (`info`, `success`, `warning`, `danger`) take `color.status.<variant>.surface`, `.text` and `.border`.
- `sm`, `md` and `lg` take `size.control.*` for the height of controls, `size.icon.*` for icons, and `font-size.small`, `font-size.body` and `font-size.large`.

### Focus, disabled and motion

- **Focus:** `:focus-visible` draws an outline of `border-width.focus` in `color.focus.ring`, offset by `outline-offset.focus`. Focus is never shown with colour alone.
- **Disabled:** background in `color.surface.subtle`, text in `color.text.disabled`, borders in `color.border.default`, and no hover style. A disabled control isn't made transparent.
- **Motion:** transitions use `motion.duration.*` and `motion.easing.*`, and only on colour, shadow, opacity and transform. Under `prefers-reduced-motion: reduce`, a component has no transition or animation, and a spinner shows a still indicator. The verifier renders with reduced motion, so captures are stable.
- **Surfaces:** cards use `color.surface.raised`, `radius.surface` and `shadow.raised`; menus, popovers and tooltips `shadow.popover`; the dialog `radius.dialog` and `shadow.dialog` over `color.overlay`.

## Accessibility

| Rule | Kept by |
|---|---|
| The roles, names and ARIA attributes in the spec's `a11y` block are what the component renders. | Enforced: `a11y` (`spec-role`, `spec-name`, `spec-aria`) |
| Interactive elements are at least 24 by 24 CSS pixels, or spaced as WCAG 2.5.8 allows. | Enforced: `layout` (`target-size`) |
| Text contrast meets WCAG AA in both themes. | Enforced: `a11y` (`color-contrast`) |
| Control boundaries, focus rings and state indicators reach 3:1 against what's next to them, by using the roles meant for them (`color.border.strong`, `color.focus.ring`, `color.control.*`). | Guidance; the token set's roles are measured in [its contrast table](../tokens/README.md#contrast) |
| Native elements first: a button is a `<button>`, a link an `<a href>`, a checkbox an `<input type="checkbox">`. | Guidance |
| Icons that carry no meaning are `aria-hidden="true"`; an icon-only control takes its name from a prop. | Guidance; the name is enforced through `a11y` |

## Headless primitives

| Component | Builds on |
|---|---|
| Dialog, Menu, Popover, Select, Tabs, Tooltip | Reka UI: each part wraps the Reka UI part of the same name (Menu's parts wrap those of `DropdownMenu`), which owns focus, keyboard and positioning |
| Button, Link, Badge, Avatar, Spinner, Card | native elements |
| TextField, Textarea, Checkbox, RadioGroup, Switch | native form elements, so forms and labels work without script |

Guidance: no check confirms which primitive a component builds on; the behaviour tests and the `a11y` check measure the result. Reka UI's `asChild` is offered only where the spec's Vue extension adds it.

## Fonts and icons

- The library's stylesheet loads Inter from `@fontsource-variable/inter`; components never load a font themselves.
- Icons come from the fixture icon set (Lucide) in stories, and from the `icon` slot in components. A component doesn't import an icon set, except a fixed glyph its spec names, such as a checkbox's check mark, drawn as inline SVG with `currentColor`.
