<template>
  <span
    :class="['inline-flex min-w-0', hoverClass]"
    @pointerleave="content?.onPointerLeave()"
    @pointerover="isActive = true"
    @pointermove="content?.onPointerMove($event)"
  >
    <slot>
      <AppIcon v-if="icon" :name="icon" :class="iconClass" />
      {{ trigger }}
    </slot>

    <AppTooltipContent v-if="isActive" ref="content" :class="$attrs.class" @close="isActive = false">
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
</script>
