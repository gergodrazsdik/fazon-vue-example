# Token set

The library's design tokens: a [DTCG 2025.10](https://www.designtokens.org/tr/2025.10/) resolver document and the token files it names, in the format the framework's [token set](https://github.com/gergodrazsdik/fazon/blob/main/docs/spec/tokens.md) spec describes. `fazon sync` builds them into `src/tokens.css`, with the prefix `fz` from `fazon.yaml`, so `color.action.primary` is `--fz-color-action-primary`. Components use role tokens only ([conventions](../docs/conventions.md#styling)).

| File | What it is |
|---|---|
| [tokens.resolver.json](tokens.resolver.json) | The resolver document: the sets and the `theme` modifier (`paths.tokens` in `fazon.yaml`) |
| [raw.json](raw.json) | Raw tokens: palette, scales, shadows, motion |
| [roles.json](roles.json) | Role tokens that are the same in both themes |
| [themes/light.json](themes/light.json), [themes/dark.json](themes/dark.json) | Colour roles per theme |

The values change only through a reviewed pull request; after a change, run `fazon sync` and commit the rebuilt `src/tokens.css` with it.

## Approval

The maintainer approves the token values once, by merging the pull request that adds them ([brief](https://github.com/gergodrazsdik/fazon/blob/main/docs/design/brief.md#tokens)). Every text pair meets WCAG 2.2's 4.5:1 and every boundary of a control meets 3:1 in both themes ([contrast](#contrast)).

## Values

A cool grey with a blue accent, and red, green and amber for status. The font is [Inter](https://rsms.me/inter/) (SIL Open Font License 1.1), which the library bundles from the `@fontsource-variable/inter` package, pinned in `package.json`, so the verifier, laptops and apps render the same glyphs.

| Scale | Steps |
|---|---|
| `color.neutral` | 0 `#ffffff`, 50 `#f6f7f9`, 100 `#eceef2`, 200 `#dcdfe5`, 300 `#c3c8d0`, 400 `#9ba2ad`, 500 `#6f7783`, 600 `#565d69`, 700 `#41464f`, 800 `#2c3038`, 900 `#1c1f25`, 950 `#121417` |
| `color.blue` | 50 `#eef3fe`, 100 `#dbe5fd`, 200 `#bccefb`, 300 `#93b0f8`, 400 `#6d95f5`, 500 `#3f72ee`, 600 `#2154d9`, 700 `#1a43ad`, 800 `#183a8a`, 900 `#172f6b`, 950 `#101c40` |
| `color.red` | 50 `#fef2f2`, 300 `#f5a3a3`, 400 `#ef7676`, 600 `#c42b2b`, 700 `#a12020`, 950 `#3b0e0e` |
| `color.green` | 50 `#edf9f1`, 300 `#7fd3a0`, 400 `#4dbb7a`, 600 `#1b7a44`, 700 `#156237`, 950 `#0a2617` |
| `color.amber` | 50 `#fff8eb`, 300 `#f8c55c`, 400 `#f0aa2a`, 600 `#a35c00`, 700 `#7d4700`, 950 `#2e1b00` |
| `color.black-alpha` | 8 (0.08), 12 (0.12), 16 (0.16), 48 (0.48), 64 (0.64) |

| Group | Raw steps | Role tokens |
|---|---|---|
| `space` | 0-5 2px, 1 4px, 1-5 6px, 2 8px, 3 12px, 4 16px, 5 20px, 6 24px, 8 32px | `space.inset.{xs, sm, md, lg, xl}`: 4, 8, 12, 16, 24 px; `space.gap.{xs, sm, md, lg}`: 4, 8, 12, 16 px |
| `size` | 4 16px, 5 20px, 6 24px, 8 32px, 10 40px, 12 48px | `size.control.{sm, md, lg}`: 32, 40, 48 px; `size.icon.{sm, md, lg}`: 16, 20, 24 px; `size.avatar.{sm, md, lg}`: 24, 32, 48 px |
| `radius` | 1 4px, 2 6px, 3 8px, 4 12px, max 9999px | `radius.small` 4px, `radius.control` 6px, `radius.surface` 8px, `radius.dialog` 12px, `radius.full` |
| `border-width` | 1 1px, 2 2px | `border-width.default` 1px, `border-width.focus` 2px; `outline-offset.focus` 2px |
| `font-family` | inter: Inter Variable (the `@fontsource-variable/inter` family), Inter, system-ui, sans-serif | `font-family.body` |
| `font-size` | 1 0.75rem, 2 0.875rem, 3 1rem, 4 1.125rem | `font-size.small` 12px, `font-size.body` 14px, `font-size.large` 16px, `font-size.title` 18px |
| `font-weight` | 400, 500, 600 | `font-weight.body` 400, `font-weight.medium` 500, `font-weight.strong` 600 |
| `line-height` | 1 1.25, 2 1.5 | `line-height.tight` 1.25, `line-height.body` 1.5 |
| `shadow` | 1, 2, 3: one or two black layers, from 0 1px 2px to 0 16px 40px | `shadow.raised`, `shadow.popover`, `shadow.dialog` |
| `duration` | 100, 150, 250 ms | `motion.duration.{fast, normal, slow}` |
| `easing` | standard (0.2, 0, 0, 1), decelerate (0, 0, 0, 1), accelerate (0.3, 0, 1, 1) | `motion.easing.{standard, enter, exit}` |

The colour roles point at these raw tokens, under `color.`, in each theme:

| Role | Light | Dark |
|---|---|---|
| `color.surface.base` | `neutral.0` | `neutral.950` |
| `color.surface.raised` | `neutral.0` | `neutral.900` |
| `color.surface.subtle` | `neutral.50` | `neutral.900` |
| `color.surface.hover` | `neutral.100` | `neutral.800` |
| `color.surface.active` | `neutral.200` | `neutral.700` |
| `color.surface.inverse` | `neutral.900` | `neutral.100` |
| `color.overlay` | `black-alpha.48` | `black-alpha.64` |
| `color.text.primary` | `neutral.900` | `neutral.100` |
| `color.text.secondary` | `neutral.600` | `neutral.400` |
| `color.text.disabled` | `neutral.400` | `neutral.600` |
| `color.text.action` | `blue.600` | `blue.200` |
| `color.text.action-hover` | `blue.700` | `blue.100` |
| `color.text.action-active` | `blue.800` | `blue.50` |
| `color.text.on-action` | `neutral.0` | `neutral.950` |
| `color.text.inverse` | `neutral.0` | `neutral.900` |
| `color.border.default` | `neutral.200` | `neutral.800` |
| `color.border.strong` | `neutral.500` | `neutral.500` |
| `color.action.primary` | `blue.600` | `blue.400` |
| `color.action.primary-hover` | `blue.700` | `blue.300` |
| `color.action.primary-active` | `blue.800` | `blue.200` |
| `color.focus.ring` | `blue.500` | `blue.400` |
| `color.control.track` | `neutral.500` | `neutral.500` |
| `color.control.thumb` | `neutral.0` | `neutral.950` |
| `color.status.info.surface` | `blue.50` | `blue.950` |
| `color.status.info.text` | `blue.700` | `blue.300` |
| `color.status.info.border` | `blue.600` | `blue.400` |
| `color.status.success.surface` | `green.50` | `green.950` |
| `color.status.success.text` | `green.700` | `green.300` |
| `color.status.success.border` | `green.600` | `green.400` |
| `color.status.warning.surface` | `amber.50` | `amber.950` |
| `color.status.warning.text` | `amber.700` | `amber.300` |
| `color.status.warning.border` | `amber.600` | `amber.400` |
| `color.status.danger.surface` | `red.50` | `red.950` |
| `color.status.danger.text` | `red.700` | `red.300` |
| `color.status.danger.border` | `red.600` | `red.400` |

Shadows, sizes, spacing, type and motion are the same in both themes.

## Contrast

Computed with the WCAG 2.2 formula from the raw colours each role points at. Text pairs need 4.5:1; control boundaries, focus rings and state indicators need 3:1 against what's next to them. Disabled text (`color.text.disabled`) has no requirement, and the `a11y` check measures the rendered pairs in every story.

| Pair | Needs | Light | Dark |
|---|---|---|---|
| `text.primary` on `surface.base` | 4.5 | 16.51 | 15.88 |
| `text.primary` on `surface.raised` | 4.5 | 16.51 | 14.21 |
| `text.primary` on `surface.subtle` | 4.5 | 15.40 | 14.21 |
| `text.primary` on `surface.hover` | 4.5 | 14.21 | 11.39 |
| `text.primary` on `surface.active` | 4.5 | 12.37 | 8.17 |
| `text.secondary` on `surface.base` | 4.5 | 6.63 | 7.17 |
| `text.secondary` on `surface.raised` | 4.5 | 6.63 | 6.42 |
| `text.secondary` on `surface.subtle` | 4.5 | 6.19 | 6.42 |
| `text.action` on `surface.base` | 4.5 | 6.30 | 11.74 |
| `text.action` on `surface.raised` | 4.5 | 6.30 | 10.50 |
| `text.action` on `surface.hover` | 4.5 | 5.42 | 8.42 |
| `text.action` on `surface.active` | 4.5 | 4.72 | 6.03 |
| `text.action-hover` on `surface.base` | 4.5 | 8.57 | 14.62 |
| `text.action-hover` on `surface.raised` | 4.5 | 8.57 | 13.08 |
| `text.action-active` on `surface.base` | 4.5 | 10.44 | 16.59 |
| `text.action-active` on `surface.raised` | 4.5 | 10.44 | 14.85 |
| `text.on-action` on `action.primary` | 4.5 | 6.30 | 6.39 |
| `text.on-action` on `action.primary-hover` | 4.5 | 8.57 | 8.62 |
| `text.on-action` on `action.primary-active` | 4.5 | 10.44 | 11.74 |
| `text.inverse` on `surface.inverse` | 4.5 | 16.51 | 14.21 |
| `status.info.text` on `status.info.surface` | 4.5 | 7.71 | 7.77 |
| `status.info.text` on `surface.base` | 4.5 | 8.57 | 8.62 |
| `status.success.text` on `status.success.surface` | 4.5 | 6.85 | 9.00 |
| `status.success.text` on `surface.base` | 4.5 | 7.41 | 10.30 |
| `status.warning.text` on `status.warning.surface` | 4.5 | 7.17 | 10.32 |
| `status.warning.text` on `surface.base` | 4.5 | 7.57 | 11.54 |
| `status.danger.text` on `status.danger.surface` | 4.5 | 7.00 | 8.49 |
| `status.danger.text` on `surface.base` | 4.5 | 7.66 | 9.36 |
| `border.strong` on `surface.base` | 3 | 4.52 | 4.08 |
| `border.strong` on `surface.raised` | 3 | 4.52 | 3.65 |
| `focus.ring` on `surface.base` | 3 | 4.33 | 6.39 |
| `focus.ring` on `surface.raised` | 3 | 4.33 | 5.71 |
| `action.primary` on `surface.base` | 3 | 6.30 | 6.39 |
| `control.track` on `surface.base` | 3 | 4.52 | 4.08 |
| `control.thumb` on `control.track` | 3 | 4.52 | 4.08 |
| `control.thumb` on `action.primary` | 3 | 6.30 | 6.39 |
| `status.info.border` on `surface.base` | 3 | 6.30 | 6.39 |
| `status.success.border` on `surface.base` | 3 | 5.37 | 7.65 |
| `status.warning.border` on `surface.base` | 3 | 5.14 | 9.22 |
| `status.danger.border` on `surface.base` | 3 | 5.63 | 6.61 |
