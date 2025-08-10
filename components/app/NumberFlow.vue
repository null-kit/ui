<template>
  <TransitionGroup
    tag="div"
    class="inline-flex"
    style="mask-image: linear-gradient(transparent 10%, #000 20%, #000 80%, transparent 90%)"
    :enter-from-class="getDirection()"
    :leave-to-class="getDirection()"
    leave-active-class="w-0"
    enter-active-class="duration-1000 ease-[cubic-bezier(.2,.9,.3,1.3)]"
    :appear
  >
    <div
      v-for="(item, index) in numbers"
      :key="`${item}-${index}`"
      :style="`transition-delay: -${index * 0.05}s;`"
      v-text="item"
    />
  </TransitionGroup>
</template>

<script setup lang="ts">
const props = defineProps<{ value: number | string; appear?: boolean }>();

const numbers = computed(() => String(props.value).split(''));

const getDirection = () => {
  return Math.random() > 0.5 ? '-translate-y-10' : 'translate-y-10' + ' opacity-0';
};
</script>
