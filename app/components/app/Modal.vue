<template>
  <Teleport to="#teleports">
    <Transition enter-from-class="opacity-0" leave-to-class="opacity-0">
      <div v-if="isActive" class="fixed inset-0 z-10 bg-black/50 backdrop-blur-xs duration-400" />
    </Transition>

    <Transition
      enter-from-class="opacity-0 modal-motion"
      enter-to-class="duration-400"
      leave-to-class="opacity-0 modal-motion duration-400"
      :duration="400"
      @after-enter="(el) => (el as HTMLDivElement).focus()"
      @after-leave="$emit('close')"
    >
      <div
        v-if="isActive"
        role="dialog"
        class="fixed inset-0 z-10 flex overflow-auto p-4 outline-0 md:p-10"
        tabindex="0"
        @keydown.esc="onPreventClose"
        @click.self="onDismiss"
      >
        <div class="modal-content m-auto w-full" :class="modalClass">
          <slot v-if="$slots.header || $slots.title" name="header">
            <div class="flex items-center p-4">
              <slot v-if="$slots.title" name="title" />

              <button
                v-if="!preventClose"
                type="button"
                class="ml-auto opacity-50 duration-200 hover:opacity-100"
                @click="onClose"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" class="size-6">
                  <path d="M25 7L7 25 M25 25L7 7" stroke="currentColor" stroke-width="2" />
                </svg>
              </button>
            </div>
          </slot>

          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const {
  modalClass = 'max-w-xl',
  preventClose = false,
  dismissible = false
} = defineProps<{
  modalClass?: string;
  preventClose?: boolean;
  dismissible?: boolean;
}>();

defineEmits<{ close: [] }>();

const isActive = ref(false);

const onClose = () => {
  isActive.value = false;
  document.body.removeAttribute('style');
};

const onPreventClose = () => {
  if (preventClose) return;

  onClose();
};

const onDismiss = () => {
  if (!dismissible) return;

  onClose();
};

defineExpose({ onClose });

onMounted(() => {
  isActive.value = true;
  document.body.style.overflow = 'hidden';
});

onUnmounted(() => {
  isActive.value = false;
  document.body.removeAttribute('style');
});
</script>
