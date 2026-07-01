<template>
  <div ref="reference" @click="onTriggerClick" @pointerenter="onPointerEnter" @pointerleave="onPointerLeave">
    <slot name="trigger" :is-open :disabled />

    <AppDropdownContent
      v-if="isOpen"
      ref="floating"
      v-bind="{ placement, dropdownClass, innerClass, maxHeight, inline, reference, noFocus }"
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
  autoclose?: boolean | 'delayed';
  inline?: boolean;

  hoverOpen?: boolean | 'delayed';
  noToggle?: boolean;
  noFocus?: boolean;
  disabled?: boolean;
}>();

const isOpen = ref(false);

const reference = useTemplateRef('reference');
const floating = useTemplateRef('floating');

const onTriggerClick = () => {
  if ((props.noToggle && isOpen.value) || props.disabled) return;

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

const onFloatingClose = () => {
  if (isOpen.value) floating.value?.onClose();
};

const onPointerEnter = () => {
  if (props.hoverOpen) isOpen.value = true;
};

const onPointerLeave = () => {
  if (props.hoverOpen && props.inline) onFloatingClose();
};

const onOpen = () => {
  if (props.disabled) return;

  isOpen.value = true;
};

defineExpose({ onClose: onFloatingClose, onOpen });
</script>
