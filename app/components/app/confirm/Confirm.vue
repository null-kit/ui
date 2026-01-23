<template>
  <div ref="reference" class="w-fit" @click="isOpen = !isOpen">
    <slot />

    <AppConfirmContent v-if="isOpen" v-bind="{ ...props, reference }" @close="isOpen = false" @confirm="onConfirm" />
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{ confirm: [] }>();

const props = withDefaults(
  defineProps<{
    title?: string;
    message?: string;
    confirmText?: string;
    confirmClass?: string;
  }>(),
  {
    title: 'Confirm',
    confirmText: 'Confirm',
    confirmClass: 'btn-danger'
  }
);

const reference = useTemplateRef<HTMLElement>('reference');

const isOpen = ref(false);

const onConfirm = () => {
  isOpen.value = false;
  emit('confirm');
};
</script>
