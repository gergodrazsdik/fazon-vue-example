<script setup lang="ts">
import { DialogTitle } from "reka-ui";

defineOptions({ name: "FzDialogTitle" });

defineSlots<{
  /** The title text. */
  default(): unknown;
}>();
</script>

<template>
  <DialogTitle class="title" data-part="Title"><slot /></DialogTitle>
</template>

<style scoped>
.title {
  flex: none;
  margin: 0;
  /* Room for the close button in the corner. */
  padding-inline-end: var(--fz-size-control-sm);
  font-size: var(--fz-font-size-title);
  font-weight: var(--fz-font-weight-strong);
  line-height: var(--fz-line-height-tight);
}
</style>
