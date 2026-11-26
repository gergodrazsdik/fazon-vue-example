<script setup lang="ts">
import { ref } from "vue";

defineOptions({ name: "FzButton", inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    /** Visual emphasis. Primary is the main action of a view. */
    variant?: "primary" | "secondary" | "ghost";
    size?: "sm" | "md" | "lg";
    disabled?: boolean;
    /** Shows a spinner in place of the icon and blocks activation. */
    loading?: boolean;
    /** The native button type, for use inside a form. */
    type?: "button" | "submit" | "reset";
  }>(),
  { variant: "primary", size: "md", disabled: false, loading: false, type: "button" },
);

const emit = defineEmits<{
  /** Activation by pointer or keyboard. Not emitted while disabled or loading. */
  click: [];
}>();

const slots = defineSlots<{
  /** The label. */
  default(): unknown;
  /** An icon before the label. */
  icon?(): unknown;
}>();

const element = ref<HTMLButtonElement>();

/** Blocks activation while loading: no event, and no form submission or reset. */
function activate(event: MouseEvent): void {
  if (props.loading) {
    event.preventDefault();
    return;
  }
  emit("click");
}

defineExpose({
  /** Moves focus to the button. */
  focus: (): void => element.value?.focus(),
});
</script>

<template>
  <button
    v-bind="$attrs"
    ref="element"
    data-part="Button"
    :data-variant="props.variant"
    :data-size="props.size"
    :data-disabled="props.disabled ? '' : undefined"
    :data-loading="props.loading ? '' : undefined"
    :type="props.type"
    :disabled="props.disabled"
    :aria-busy="props.loading ? 'true' : undefined"
    :aria-disabled="props.loading ? 'true' : undefined"
    @click="activate"
  >
    <span v-if="props.loading" class="spinner" aria-hidden="true"></span>
    <span v-else-if="slots.icon" class="icon" aria-hidden="true"><slot name="icon" /></span>
    <span class="label"><slot /></span>
  </button>
</template>

<style scoped>
button {
  --_height: var(--fz-size-control-md);
  --_padding-inline: var(--fz-space-inset-md);
  --_gap: var(--fz-space-gap-sm);
  --_font-size: var(--fz-font-size-body);
  --_icon-size: var(--fz-size-icon-sm);

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--_gap);
  box-sizing: border-box;
  min-height: var(--_height);
  max-width: 100%;
  margin: 0;
  padding-block: var(--fz-space-inset-xs);
  padding-inline: var(--_padding-inline);
  border-width: var(--fz-border-width-default);
  border-style: solid;
  border-color: transparent;
  border-radius: var(--fz-radius-control);
  background-color: transparent;
  font-family: var(--fz-font-family-body);
  font-size: var(--_font-size);
  font-weight: var(--fz-font-weight-medium);
  line-height: var(--fz-line-height-tight);
  letter-spacing: normal;
  text-align: center;
  cursor: pointer;
  transition-property: background-color, border-color, color;
  transition-duration: var(--fz-motion-duration-fast);
  transition-timing-function: var(--fz-motion-easing-standard);
}

/* Sizes: the control's height, its inline padding, the label's size and the icon's. */
[data-size="sm"] {
  --_height: var(--fz-size-control-sm);
  --_padding-inline: var(--fz-space-inset-sm);
  --_gap: var(--fz-space-gap-xs);
  --_font-size: var(--fz-font-size-small);
  --_icon-size: var(--fz-size-icon-sm);
}

[data-size="lg"] {
  --_height: var(--fz-size-control-lg);
  --_padding-inline: var(--fz-space-inset-lg);
  --_font-size: var(--fz-font-size-large);
  --_icon-size: var(--fz-size-icon-md);
}

/* Variants and their states, as the spec's token rules set them. Loading keeps the default look. */
[data-variant="primary"] {
  background-color: var(--fz-color-action-primary);
  color: var(--fz-color-text-on-action);
}

[data-variant="primary"]:hover:not(:disabled, [data-loading]) {
  background-color: var(--fz-color-action-primary-hover);
}

[data-variant="primary"]:active:not(:disabled, [data-loading]) {
  background-color: var(--fz-color-action-primary-active);
}

[data-variant="secondary"] {
  border-color: var(--fz-color-border-default);
  background-color: var(--fz-color-surface-raised);
  color: var(--fz-color-text-primary);
}

[data-variant="ghost"] {
  color: var(--fz-color-text-action);
}

[data-variant="secondary"]:hover:not(:disabled, [data-loading]),
[data-variant="ghost"]:hover:not(:disabled, [data-loading]) {
  background-color: var(--fz-color-surface-hover);
}

[data-variant="secondary"]:active:not(:disabled, [data-loading]),
[data-variant="ghost"]:active:not(:disabled, [data-loading]) {
  background-color: var(--fz-color-surface-active);
}

/* Disabled, in every variant: no hover or active style, and not transparent. */
button:disabled {
  border-color: var(--fz-color-border-default);
  background-color: var(--fz-color-surface-subtle);
  color: var(--fz-color-text-disabled);
}

button:focus-visible {
  outline-width: var(--fz-border-width-focus);
  outline-style: solid;
  outline-color: var(--fz-color-focus-ring);
  outline-offset: var(--fz-outline-offset-focus);
}

button:disabled,
[data-loading] {
  cursor: not-allowed;
}

.icon,
.spinner {
  display: inline-flex;
  flex: none;
  width: var(--_icon-size);
  height: var(--_icon-size);
}

.icon :slotted(svg) {
  width: 100%;
  height: 100%;
}

.spinner {
  box-sizing: border-box;
  border-width: var(--fz-border-width-focus);
  border-style: solid;
  border-color: currentColor;
  border-inline-end-color: transparent;
  border-radius: var(--fz-radius-full);
  animation-name: spin;
  animation-duration: calc(var(--fz-motion-duration-slow) * 3);
  animation-timing-function: var(--fz-motion-easing-standard);
  animation-iteration-count: infinite;
}

.label {
  min-width: 0;
  overflow-wrap: anywhere;
}

@keyframes spin {
  to {
    transform: rotate(1turn);
  }
}

@media (prefers-reduced-motion: reduce) {
  button {
    transition-property: none;
  }

  .spinner {
    animation-name: none;
  }
}
</style>
