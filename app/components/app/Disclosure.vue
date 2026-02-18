<template>
  <div role="details">
    <div role="summary" class="cursor-default" :class="styles" @click="noToggle ? $event.preventDefault() : onToggle()">
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
        v-if="!noChevron && !noToggle && !slots.summary"
        name="chevron-right"
        class="duration-300"
        :class="isOpen ? 'rotate-90 cursor-s-resize' : 'cursor-n-resize'"
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
const slots = useSlots();

const props = defineProps<{
  open?: boolean;
  title?: string;
  titleClass?: string;
  summaryClass?: string;
  contentClass?: string;
  chevron?: boolean;
  noChevron?: boolean;
  noToggle?: boolean;
  prefix?: boolean;
  icon?: string;
}>();

const isOpen = ref(props.open);

const onToggle = () => {
  isOpen.value = !isOpen.value;
};

const styles = computed(() => {
  if (slots.summary) return '';

  const defaultStyles = ['flex items-center gap-2 border-b px-4 py-2'];

  if (props.summaryClass) defaultStyles.push(props.summaryClass);

  if (isOpen.value) defaultStyles.push('border-edison');
  else defaultStyles.push('border-transparent');

  return defaultStyles;
});

watch(
  () => props.open,
  (value) => (isOpen.value = value)
);
</script>
