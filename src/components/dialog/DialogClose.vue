<script setup lang="ts">
import { DialogClose } from "reka-ui";

defineOptions({ name: "FzDialogClose" });

const props = withDefaults(defineProps<{ label?: string }>(), { label: "Close" });
</script>

<template>
  <DialogClose class="close" data-part="Close" :aria-label="props.label">
    <svg
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
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  </DialogClose>
</template>

<style scoped>
.close {
  position: absolute;
  inset-block-start: var(--fz-space-inset-lg);
  inset-inline-end: var(--fz-space-inset-lg);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: var(--fz-size-control-sm);
  height: var(--fz-size-control-sm);
  margin: 0;
  padding: 0;
  border-width: 0;
  border-style: none;
  border-color: transparent;
  border-radius: var(--fz-radius-control);
  background-color: transparent;
  color: var(--fz-color-text-secondary);
  font-family: var(--fz-font-family-body);
  font-size: var(--fz-font-size-body);
  font-weight: var(--fz-font-weight-body);
  line-height: var(--fz-line-height-tight);
  letter-spacing: normal;
  text-align: center;
  cursor: pointer;
  transition-property: background-color;
  transition-duration: var(--fz-motion-duration-fast);
  transition-timing-function: var(--fz-motion-easing-standard);
}

.close:hover {
  background-color: var(--fz-color-surface-hover);
}

.close:focus-visible {
  outline-width: var(--fz-border-width-focus);
  outline-style: solid;
  outline-color: var(--fz-color-focus-ring);
  outline-offset: var(--fz-outline-offset-focus);
}

.icon {
  width: var(--fz-size-icon-sm);
  height: var(--fz-size-icon-sm);
}

@media (prefers-reduced-motion: reduce) {
  .close {
    transition-property: none;
  }
}
</style>
