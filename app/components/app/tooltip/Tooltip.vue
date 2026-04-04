<template>
  <span :class="['inline-flex min-w-0', hoverClass]" @pointerleave="onPointerLeave" @pointermove="onPointerMove">
    <slot>
      <AppIcon v-if="icon" :name="icon" :class="iconClass" />
      {{ trigger }}
    </slot>

    <AppTooltipContent v-if="isActive" ref="content" :class="$attrs.class">
      <slot name="message">{{ message }}</slot>
    </AppTooltipContent>
  </span>
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false });

defineProps<{
  trigger?: string;
  message?: string;
  hoverClass?: string;
  icon?: string;
  iconClass?: string;
}>();

const isActive = ref(false);

const content = useTemplateRef('content');

const onPointerLeave = () => {
  isActive.value = false;
};

const onPointerMove = (event: PointerEvent) => {
  content.value?.onPointerMove(event);
  isActive.value = true;
};
</script>
