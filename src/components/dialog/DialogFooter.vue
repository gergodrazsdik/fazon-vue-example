<script setup lang="ts">
defineOptions({ name: "FzDialogFooter" });

defineSlots<{
  /** The actions, with the primary action last. */
  default(): unknown;
}>();
</script>

<template>
  <div class="footer" data-part="Footer"><slot /></div>
</template>

<style scoped>
.footer {
  display: flex;
  flex: none;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: var(--fz-space-gap-sm);
  margin-block-start: var(--fz-space-gap-sm);
}
</style>
