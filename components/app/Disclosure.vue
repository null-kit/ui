<template>
  <details :open>
    <summary
      class="flex items-center gap-2"
      :class="[
        isOpen ? 'cursor-n-resize' : 'cursor-s-resize',
        !summaryClass && 'border-b px-4 py-2',
        isOpen && !summaryClass ? 'border-edison' : 'border-transparent',
        summaryClass
      ]"
      @click="isOpen = !isOpen"
    >
      <slot name="summary" :is-open>
        <slot name="icon">
          <AppIcon v-if="icon" :name="icon" />
        </slot>

        <span :class="titleClass">
          <span v-if="prefix || !title">{{ isOpen ? 'Hide' : 'Show' }}</span>
          {{ title }}
        </span>
      </slot>

      <AppIcon v-if="!noChevron" name="chevron-right" class="duration-300" :class="{ 'rotate-90': isOpen }" />
    </summary>

    <Transition enter-from-class="opacity-0 translate-y-4" enter-active-class="duration-300">
      <div v-if="isOpen" :class="contentClass">
        <slot />
      </div>
    </Transition>
  </details>
</template>

<script setup lang="ts">
const props = defineProps<{
  open?: boolean;
  title?: string;
  titleClass?: string;
  summaryClass?: string;
  contentClass?: string;
  noChevron?: boolean;
  prefix?: boolean;
  icon?: string;
}>();

const isOpen = ref(props.open);
</script>
