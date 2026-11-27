<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";

defineOptions({ name: "FzDialogBody" });

defineSlots<{
  /** The body content. */
  default(): unknown;
}>();

const body = ref<HTMLElement>();
const content = ref<HTMLElement>();
const scrollable = ref(false);
let observer: ResizeObserver | undefined;

// A body that scrolls takes focus, so the keyboard can scroll it.
onMounted(() => {
  observer = new ResizeObserver(() => {
    const element = body.value;
    scrollable.value = element !== undefined && element.scrollHeight > element.clientHeight;
  });
  if (body.value) observer.observe(body.value);
  if (content.value) observer.observe(content.value);
});
onBeforeUnmount(() => observer?.disconnect());
</script>

<template>
  <div ref="body" class="body" data-part="Body" :tabindex="scrollable ? 0 : undefined">
    <div ref="content" class="inner"><slot /></div>
  </div>
</template>

<style scoped>
/* The padding, taken back by the margin, leaves room for the focus rings of what's inside. */
.body {
  flex: 0 1 auto;
  min-height: 0;
  margin: calc(var(--fz-space-inset-xs) * -1);
  padding: var(--fz-space-inset-xs);
  overflow-y: auto;
  border-radius: var(--fz-radius-small);
}

.body:focus-visible {
  outline-width: var(--fz-border-width-focus);
  outline-style: solid;
  outline-color: var(--fz-color-focus-ring);
  outline-offset: 0;
}

.inner {
  display: flow-root;
}

.inner :slotted(p) {
  margin: 0;
}

.inner :slotted(* + p) {
  margin-block-start: var(--fz-space-gap-md);
}
</style>
