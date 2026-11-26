<script setup lang="ts">
defineOptions({ name: "FzBadge", inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    /** The tone. The label says what the badge means; the tone only reinforces it. */
    tone?: "neutral" | "info" | "success" | "warning" | "danger";
    size?: "sm" | "md";
  }>(),
  { tone: "neutral", size: "md" },
);

const slots = defineSlots<{
  /** The label: one to three words, in sentence case. */
  default(): unknown;
  /** A decorative icon before the label. */
  icon?(): unknown;
}>();
</script>

<template>
  <span v-bind="$attrs" data-part="Badge" :data-tone="props.tone" :data-size="props.size">
    <span v-if="slots.icon" class="icon" aria-hidden="true"><slot name="icon" /></span>
    <span class="label"><slot /></span>
  </span>
</template>

<style scoped>
[data-part="Badge"] {
  --_padding-block: var(--fz-space-inset-xs);
  --_padding-inline: var(--fz-space-inset-sm);
  --_font-size: var(--fz-font-size-body);

  display: inline-flex;
  align-items: flex-start;
  gap: var(--fz-space-gap-xs);
  box-sizing: border-box;
  max-width: 100%;
  padding-block: var(--_padding-block);
  padding-inline: var(--_padding-inline);
  border-width: var(--fz-border-width-default);
  border-style: solid;
  border-radius: var(--fz-radius-small);
  font-family: var(--fz-font-family-body);
  font-size: var(--_font-size);
  font-weight: var(--fz-font-weight-medium);
  line-height: var(--fz-line-height-tight);
  letter-spacing: normal;
  text-align: start;
  white-space: normal;
  vertical-align: middle;
}

[data-size="sm"] {
  --_padding-block: 0;
  --_padding-inline: var(--fz-space-inset-xs);
  --_font-size: var(--fz-font-size-small);
}

/* Tones, as the spec's token rules set them. */
[data-tone="neutral"] {
  border-color: var(--fz-color-border-default);
  background-color: var(--fz-color-surface-subtle);
  color: var(--fz-color-text-primary);
}

[data-tone="info"] {
  border-color: var(--fz-color-status-info-border);
  background-color: var(--fz-color-status-info-surface);
  color: var(--fz-color-status-info-text);
}

[data-tone="success"] {
  border-color: var(--fz-color-status-success-border);
  background-color: var(--fz-color-status-success-surface);
  color: var(--fz-color-status-success-text);
}

[data-tone="warning"] {
  border-color: var(--fz-color-status-warning-border);
  background-color: var(--fz-color-status-warning-surface);
  color: var(--fz-color-status-warning-text);
}

[data-tone="danger"] {
  border-color: var(--fz-color-status-danger-border);
  background-color: var(--fz-color-status-danger-surface);
  color: var(--fz-color-status-danger-text);
}

/*
 * The icon's box is as tall as the label's first line: the zero-width space gives it one line
 * box, and the icon is centred in it.
 */
.icon {
  display: inline-flex;
  flex: none;
  align-items: center;
}

.icon::before {
  content: "\200b";
}

.icon :slotted(svg) {
  width: var(--fz-size-icon-sm);
  height: var(--fz-size-icon-sm);
}

.label {
  min-width: 0;
  overflow-wrap: anywhere;
}
</style>
