<template>
  <div ref="reference" @click="onTriggerClick" @pointerenter="onPointerEnter" @pointerleave="onPointerLeave">
    <slot name="trigger" :is-open />

    <AppDropdownContent
      v-if="isOpen"
      ref="floating"
      v-bind="{ placement, dropdownClass, innerClass, maxHeight, inline, reference }"
      :autoclose="autoclose || hoverOpen"
      @close="onClose"
    >
      <slot :on-close="onFloatingClose" />
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

const onFloatingClose = () => floating.value?.onClose();

const onPointerEnter = () => {
  if (props.hoverOpen) isOpen.value = true;
};

const onPointerLeave = () => {
  if (props.hoverOpen && props.inline) onFloatingClose();
};

defineExpose({ onClose: onFloatingClose });
</script>
