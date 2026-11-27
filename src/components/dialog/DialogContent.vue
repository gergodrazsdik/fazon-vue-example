<script setup lang="ts">
import { DialogContent, DialogPortal } from "reka-ui";
import { computed, inject, useAttrs } from "vue";
import { dialogKey } from "./context";

defineOptions({ name: "FzDialogContent", inheritAttrs: false });

defineSlots<{
  /** The Title, Description, Body, Footer and Close. */
  default(): unknown;
}>();

const dialog = inject(dialogKey);
const attrs = useAttrs();

// Without a Description, aria-describedby would point at nothing: Reka UI sets it regardless.
const describedBy = computed(() => (dialog?.descriptions.value ? {} : { "aria-describedby": undefined }));

/** Focus starts on the dialog itself, not on its first control. */
function focusContent(event: Event): void {
  event.preventDefault();
  (event.target as HTMLElement).focus();
}

/** Shift+Tab from the dialog itself wraps to the last element; Reka UI wraps only from the first. */
function wrapBackwards(event: KeyboardEvent): void {
  const content = event.currentTarget as HTMLElement;
  if (event.key !== "Tab" || !event.shiftKey || event.target !== content) return;
  event.preventDefault();
  const candidates = content.querySelectorAll<HTMLElement>(
    "a[href], button, input, select, textarea, [tabindex]:not([tabindex='-1'])",
  );
  [...candidates].filter((element) => !element.matches(":disabled") && element.checkVisibility()).at(-1)?.focus();
}
</script>

<template>
  <DialogPortal>
    <DialogContent
      v-bind="{ ...describedBy, ...dialog?.forwarded.value, ...attrs }"
      class="content"
      data-part="Content"
      :data-size="dialog?.size()"
      aria-modal="true"
      @open-auto-focus="focusContent"
      @keydown="wrapBackwards"
    >
      <slot />
    </DialogContent>
  </DialogPortal>
</template>

<style scoped>
/* There are no width tokens for surfaces: the widths are multiples of the large control size. */
.content {
  --_inset: var(--fz-space-inset-xl);
  --_width: calc(var(--fz-size-control-lg) * 10);

  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  gap: var(--fz-space-gap-md);
  box-sizing: border-box;
  width: var(--_width);
  max-width: calc(100% - var(--fz-space-inset-lg) * 2);
  height: fit-content;
  max-height: calc(100% - var(--fz-space-inset-lg) * 2);
  margin: auto;
  padding: var(--_inset);
  overflow: auto;
  border-width: var(--fz-border-width-default);
  border-style: solid;
  border-color: var(--fz-color-border-default);
  border-radius: var(--fz-radius-dialog);
  background-color: var(--fz-color-surface-raised);
  box-shadow: var(--fz-shadow-dialog);
  color: var(--fz-color-text-primary);
  font-family: var(--fz-font-family-body);
  font-size: var(--fz-font-size-body);
  font-weight: var(--fz-font-weight-body);
  line-height: var(--fz-line-height-body);
  letter-spacing: normal;
  text-align: start;
  overflow-wrap: anywhere;
}

[data-size="sm"] {
  --_width: calc(var(--fz-size-control-lg) * 7);
}

[data-size="lg"] {
  --_width: calc(var(--fz-size-control-lg) * 14);
}

/* The dialog takes focus only when it opens, and isn't a control: no ring around all of it. */
.content:focus-visible {
  outline: none;
}
</style>
