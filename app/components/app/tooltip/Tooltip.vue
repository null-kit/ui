<template>
  <component :is="vReference" v-if="vReference" />

  <span
    v-else
    ref="reference"
    :class="['min-w-0', triggerClass, { 'inline-flex': icon }]"
    v-bind="$attrs"
    @pointerenter="onPointerEnter"
    @pointermove="onPointerMove"
    @pointerleave="onPointerLeave"
  >
    <AppIcon v-if="icon" :name="icon" :class="iconClass" />
    {{ trigger }}
  </span>

  <LazyAppTooltipContent
    v-if="isActive || open"
    ref="content"
    :class="messageClass"
    v-bind="{ noFollow, reference, placement, open }"
    @close="isActive = false"
  >
    <slot name="message">{{ message }}</slot>
  </LazyAppTooltipContent>
</template>

<script setup lang="ts">
import { cloneVNode } from 'vue';
import type { Placement } from '@floating-ui/vue';

const slots = useSlots();

const props = defineProps<{
  trigger?: string | number;
  triggerClass?: string;
  message?: string;
  messageClass?: string;
  icon?: string;
  iconClass?: string;
  noFollow?: boolean;
  placement?: Placement;
  open?: boolean;
  disabled?: boolean;
}>();

const isActive = ref(props.open ?? false);

const reference = ref<HTMLElement | null>(null);
const content = useTemplateRef('content');

const onPointerLeave = () => {
  if (props.disabled) return;
  if (!props.open) isActive.value = false;
};

const onPointerEnter = () => {
  if (props.disabled) return;
  if (!props.open) isActive.value = true;
};

const onPointerMove = (event: PointerEvent) => {
  if (props.disabled || props.noFollow) return;
  content.value?.onPointerMove(event);
};

const vReference = computed(() => {
  const vnode = slots.default?.()[0];

  if (!vnode) return null;

  return cloneVNode(vnode, {
    ref: (el) => {
      reference.value = el as HTMLElement;
    },
    onPointerenter: onPointerEnter,
    onPointermove: onPointerMove,
    onPointerleave: onPointerLeave
  });
});

watch(
  () => props.disabled,
  () => (isActive.value = false)
);
</script>
