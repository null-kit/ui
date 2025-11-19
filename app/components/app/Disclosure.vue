<template>
  <div role="details">
    <div
      role="summary"
      class="flex items-center gap-2"
      :class="[
        noToggle ? 'cursor-default' : isOpen ? 'cursor-n-resize' : 'cursor-s-resize',
        !summaryClass && 'border-b px-4 py-2',
        isOpen && !summaryClass ? 'border-edison' : 'border-transparent',
        summaryClass
      ]"
      @click="noToggle ? $event.preventDefault() : onToggle()"
    >
      <slot name="summary" :is-open="isOpen" @toggle="onToggle">
        <slot name="icon">
          <AppIcon v-if="icon" :name="icon" />
        </slot>

        <span :class="titleClass">
          <span v-if="prefix || !title">{{ isOpen ? 'Hide' : 'Show' }}</span>
          {{ title }}
        </span>
      </slot>

      <AppIcon
        v-if="!noChevron && !noToggle"
        name="chevron-right"
        class="duration-300"
        :class="{ 'rotate-90': isOpen }"
      />
    </div>

    <Transition enter-from-class="opacity-0 translate-y-4" enter-active-class="duration-300">
      <div v-if="isOpen" :class="contentClass">
        <slot />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  open?: boolean;
  title?: string;
  titleClass?: string;
  summaryClass?: string;
  contentClass?: string;
  noChevron?: boolean;
  noToggle?: boolean;
  prefix?: boolean;
  icon?: string;
}>();

const isOpen = ref(props.open);

const onToggle = () => {
  isOpen.value = !isOpen.value;
};

watch(
  () => props.open,
  (value) => (isOpen.value = value)
);
</script>
