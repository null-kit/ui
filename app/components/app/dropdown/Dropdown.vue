<template>
  <div ref="reference" @click="onTriggerClick" @pointerenter="hoverOpen ? $el.click() : null">
    <slot name="trigger" :is-open />

    <AppDropdownContent
      v-if="isOpen"
      ref="floating"
      v-bind="{ placement, dropdownClass, innerClass, maxHeight, inline, reference }"
      :autoclose="autoclose || hoverOpen"
      @close="onClose"
    >
      <slot />
    </AppDropdownContent>
  </div>
</template>

<script setup lang="ts">
import type { Placement } from '@floating-ui/vue';

const emit = defineEmits<{ close: [] }>();

const props = defineProps<{
  placement?: Placement;
  dropdownClass?: string;
  innerClass?: string;
  maxHeight?: number;
  autoclose?: boolean;
  inline?: boolean;

  hoverOpen?: boolean;
  noToggle?: boolean;
}>();

const isOpen = ref(false);

const reference = useTemplateRef('reference');
const floating = useTemplateRef('floating');

const onTriggerClick = () => {
  if (props.noToggle && isOpen.value) return;

  if (isOpen.value) {
    floating.value?.onClose();
  } else {
    isOpen.value = true;
  }
};

const onClose = () => {
  isOpen.value = false;
  emit('close');
};

defineExpose({ onClose: floating.value?.onClose });
</script>
