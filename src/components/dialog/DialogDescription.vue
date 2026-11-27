<script setup lang="ts">
import { DialogDescription } from "reka-ui";
import { inject, onUnmounted } from "vue";
import { dialogKey } from "./context";

defineOptions({ name: "FzDialogDescription" });

defineSlots<{
  /** The description text. */
  default(): unknown;
}>();

const dialog = inject(dialogKey);
if (dialog) {
  dialog.descriptions.value += 1;
  onUnmounted(() => {
    dialog.descriptions.value -= 1;
  });
}
</script>

<template>
  <DialogDescription class="description" data-part="Description"><slot /></DialogDescription>
</template>

<style scoped>
.description {
  flex: none;
  margin: 0;
  color: var(--fz-color-text-secondary);
}
</style>
