<template>
  <span
    ref="reference"
    :class="['inline-flex min-w-0', hoverClass]"
    @pointerenter="onPointerEnter"
    @pointermove="onPointerMove"
    @pointerleave="onPointerLeave"
  >
    <slot>
      <AppIcon v-if="icon" :name="icon" :class="iconClass" />
      {{ trigger }}
    </slot>

    <LazyAppTooltipContent
      v-if="isActive || open"
      ref="content"
      :class="$attrs.class"
      v-bind="{ noFollow, reference, placement, open }"
      @close="isActive = false"
    >
      <slot name="message">{{ message }}</slot>
    </LazyAppTooltipContent>
  </span>
</template>

<script setup lang="ts">
import type { Placement } from '@floating-ui/vue';

defineOptions({ inheritAttrs: false });

const props = defineProps<{
  trigger?: string | number;
  hoverClass?: string;
  message?: string;
  icon?: string;
  iconClass?: string;
  noFollow?: boolean;
  placement?: Placement;
  open?: boolean;
}>();

const isActive = ref(props.open ?? false);

const reference = useTemplateRef('reference');
const content = useTemplateRef('content');

const onPointerLeave = () => {
  if (!props.open) isActive.value = false;
};

const onPointerEnter = () => {
  if (!props.open) isActive.value = true;
};

const onPointerMove = (event: PointerEvent) => {
  if (props.noFollow) return;

  content.value?.onPointerMove(event);
};
</script>
