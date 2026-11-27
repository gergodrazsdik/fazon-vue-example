<script setup lang="ts">
import { computed } from "vue";

defineOptions({ name: "FzLink", inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    /** The destination: another page, or a place on the current page. */
    href: string;
    /** Default is in the action colour; subtle takes the surrounding text's colour; standalone is for a link on its own line. */
    variant?: "default" | "subtle" | "standalone";
    /** Opens in a new tab, shows an icon after the text and tells assistive technology so. */
    external?: boolean;
  }>(),
  { variant: "default", external: false },
);

defineSlots<{
  /** The text, which says where the link goes. */
  default(): unknown;
}>();

// Bound only when external, so a forwarded target or rel stays on other links.
const externalAttrs = computed(() => (props.external ? { target: "_blank", rel: "noopener noreferrer" } : {}));
</script>

<template>
  <a v-bind="{ ...$attrs, ...externalAttrs }" data-part="Link" :data-variant="props.variant" :href="props.href"
    ><slot /><template v-if="props.external"
      ><svg
        class="icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M15 3h6v6" />
        <path d="M10 14 21 3" />
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></svg
      ><span class="new-tab"> (opens in a new tab)</span></template
    ></a
  >
</template>

<style scoped>
/*
 * Size, weight and line height come from the surrounding text. No block padding: it would reach
 * outside the line the link is on.
 */
a {
  position: relative;
  border-radius: var(--fz-radius-small);
  font-family: var(--fz-font-family-body);
  overflow-wrap: anywhere;
  text-decoration-line: underline;
  transition-property: color;
  transition-duration: var(--fz-motion-duration-fast);
  transition-timing-function: var(--fz-motion-easing-standard);
}

/* Variants and their states, as the spec's token rules set them. Visited links look the same. */
[data-variant="default"],
[data-variant="standalone"] {
  color: var(--fz-color-text-action);
}

[data-variant="default"]:hover,
[data-variant="standalone"]:hover {
  color: var(--fz-color-text-action-hover);
}

[data-variant="default"]:active,
[data-variant="standalone"]:active {
  color: var(--fz-color-text-action-active);
}

[data-variant="subtle"] {
  color: var(--fz-color-text-primary);
}

/* The spec gives subtle no pressed colour of its own: pressed keeps the hover colour. */
[data-variant="subtle"]:hover,
[data-variant="subtle"]:active {
  color: var(--fz-color-text-action);
}

/* A standalone link is underlined only while hovered, focused or pressed. */
[data-variant="standalone"] {
  text-decoration-line: none;
}

[data-variant="standalone"]:hover,
[data-variant="standalone"]:focus-visible,
[data-variant="standalone"]:active {
  text-decoration-line: underline;
}

a:focus-visible {
  outline-width: var(--fz-border-width-focus);
  outline-style: solid;
  outline-color: var(--fz-color-focus-ring);
  outline-offset: var(--fz-outline-offset-focus);
}

.icon {
  display: inline-block;
  width: var(--fz-size-icon-sm);
  height: var(--fz-size-icon-sm);
  margin-inline-start: var(--fz-space-gap-xs);
  /* Bottom-aligned with the text, so the icon stays within the link's box. */
  vertical-align: text-bottom;
}

/* Hidden from sight, read by assistive technology. */
.new-tab {
  position: absolute;
  inset-block-start: 0;
  inset-inline-start: 0;
  width: 0;
  height: 0;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

@media (prefers-reduced-motion: reduce) {
  a {
    transition-property: none;
  }
}
</style>
