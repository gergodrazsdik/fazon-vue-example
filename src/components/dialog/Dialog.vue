<script setup lang="ts">
import { DialogRoot } from "reka-ui";
import { onBeforeUpdate, provide, ref, shallowRef, useAttrs } from "vue";
import { dialogKey } from "./context";

defineOptions({ name: "FzDialog", inheritAttrs: false });

/** Whether the dialog is open. */
const open = defineModel<boolean>("open", { default: false });

const props = withDefaults(defineProps<{ size?: "sm" | "md" | "lg" }>(), { size: "md" });

defineSlots<{
  /** The parts. */
  default(): unknown;
}>();

// Attributes aren't reactive by themselves: a copy tells Content, which is rendered elsewhere.
const attrs = useAttrs();
const forwarded = shallowRef<Record<string, unknown>>({ ...attrs });
onBeforeUpdate(() => {
  forwarded.value = { ...attrs };
});

provide(dialogKey, { size: () => props.size, forwarded, descriptions: ref(0) });
</script>

<template>
  <DialogRoot v-model:open="open">
    <div class="dialog" data-part="Dialog" :data-size="props.size" :data-closed="open ? undefined : ''">
      <slot />
    </div>
  </DialogRoot>
</template>

<style scoped>
.dialog {
  display: inline-block;
}
</style>
