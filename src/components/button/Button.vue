<script setup lang="ts">
import { useTemplateRef } from "vue";

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

const button = useTemplateRef<HTMLButtonElement>("button");

function onClick(event: MouseEvent) {
  // A loading button stays focusable, so it isn't natively disabled: its activation is cancelled
  // here, which also keeps it from submitting or resetting a form.
  if (props.disabled || props.loading) {
    event.preventDefault();
    event.stopPropagation();
    return;
  }
  emit("click");
}

defineExpose({
  /** Moves focus to the button. */
  focus: () => button.value?.focus(),
});
</script>

<template>
  <button
    v-bind="$attrs"
    ref="button"
    data-part="Button"
    :data-variant="props.variant"
    :data-size="props.size"
    :data-disabled="props.disabled ? '' : undefined"
    :data-loading="props.loading ? '' : undefined"
    :type="props.type"
    :disabled="props.disabled"
    :aria-busy="props.loading ? 'true' : undefined"
    :aria-disabled="props.loading ? 'true' : undefined"
    @click="onClick"
  >
    <span v-if="props.loading || slots.icon" class="icon" aria-hidden="true">
      <svg v-if="props.loading" class="spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" focusable="false">
        <path d="M21 12a9 9 0 1 1-9-9" stroke-width="3" stroke-linecap="round" />
      </svg>
      <slot v-else name="icon" />
    </span>
    <span class="label"><slot /></span>
  </button>
</template>

<style scoped>
button {
  --_height: var(--fz-size-control-md);
  --_padding-inline: var(--fz-space-inset-md);
  --_font-size: var(--fz-font-size-body);
  --_icon-size: var(--fz-size-icon-md);

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--fz-space-gap-sm);
  box-sizing: border-box;
  min-width: var(--_height);
  max-width: 100%;
  min-height: var(--_height);
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
  transition-property: color, background-color, border-color;
  transition-duration: var(--fz-motion-duration-fast);
  transition-timing-function: var(--fz-motion-easing-standard);
}

[data-size="sm"] {
  --_height: var(--fz-size-control-sm);
  --_padding-inline: var(--fz-space-inset-sm);
  --_font-size: var(--fz-font-size-small);
  --_icon-size: var(--fz-size-icon-sm);
}

[data-size="lg"] {
  --_height: var(--fz-size-control-lg);
  --_padding-inline: var(--fz-space-inset-lg);
  --_font-size: var(--fz-font-size-large);
  --_icon-size: var(--fz-size-icon-lg);
}

/* Variants and their states, as the spec's token rules set them. Loading takes no hover or press. */
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

button[data-loading] {
  cursor: progress;
}

button[data-disabled] {
  border-color: var(--fz-color-border-default);
  background-color: var(--fz-color-surface-subtle);
  color: var(--fz-color-text-disabled);
  cursor: not-allowed;
}

button:focus-visible {
  outline-width: var(--fz-border-width-focus);
  outline-style: solid;
  outline-color: var(--fz-color-focus-ring);
  outline-offset: var(--fz-outline-offset-focus);
}

/* The icon and the spinner share one box, so the label stays where it is while loading. */
.icon {
  display: inline-flex;
  flex: none;
  width: var(--_icon-size);
  height: var(--_icon-size);
}

.icon :slotted(svg),
.spinner {
  width: 100%;
  height: 100%;
}

.label {
  min-width: 0;
  overflow-wrap: anywhere;
}

.spinner {
  animation-name: spin;
  animation-duration: var(--fz-motion-duration-slow);
  animation-timing-function: var(--fz-motion-easing-standard);
  animation-iteration-count: infinite;
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

  /* The arc stays, as a still indicator. */
  .spinner {
    animation-name: none;
  }
}
</style>
