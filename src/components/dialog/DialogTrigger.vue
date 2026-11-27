<script setup lang="ts">
import { DialogTrigger } from "reka-ui";

defineOptions({ name: "FzDialogTrigger" });

const props = withDefaults(defineProps<{ asChild?: boolean }>(), { asChild: false });

defineSlots<{
  /** The trigger's label, or with asChild a single Button that acts as the trigger. */
  default(): unknown;
}>();
</script>

<template>
  <DialogTrigger v-if="props.asChild" as-child data-part="Trigger"><slot /></DialogTrigger>
  <DialogTrigger v-else class="trigger" data-part="Trigger"><slot /></DialogTrigger>
</template>

<style scoped>
.trigger {
  box-sizing: border-box;
  min-height: var(--fz-size-control-md);
  max-width: 100%;
  margin: 0;
  padding-block: var(--fz-space-inset-xs);
  padding-inline: var(--fz-space-inset-md);
  border-width: var(--fz-border-width-default);
  border-style: solid;
  border-color: var(--fz-color-border-default);
  border-radius: var(--fz-radius-control);
  background-color: var(--fz-color-surface-raised);
  color: var(--fz-color-text-primary);
  font-family: var(--fz-font-family-body);
  font-size: var(--fz-font-size-body);
  font-weight: var(--fz-font-weight-medium);
  line-height: var(--fz-line-height-tight);
  letter-spacing: normal;
  text-align: center;
  cursor: pointer;
}

.trigger:hover {
  background-color: var(--fz-color-surface-hover);
}

.trigger:active {
  background-color: var(--fz-color-surface-active);
}

.trigger:focus-visible {
  outline-width: var(--fz-border-width-focus);
  outline-style: solid;
  outline-color: var(--fz-color-focus-ring);
  outline-offset: var(--fz-outline-offset-focus);
}
</style>
