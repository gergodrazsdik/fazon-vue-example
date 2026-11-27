<script setup lang="ts">
import { DialogOverlay, DialogPortal } from "reka-ui";

defineOptions({ name: "FzDialogOverlay" });
</script>

<template>
  <DialogPortal>
    <DialogOverlay class="overlay" data-part="Overlay" />
  </DialogPortal>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background-color: var(--fz-color-overlay);
}
</style>
