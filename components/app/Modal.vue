<template>
  <Teleport to="#teleports" class="perspective-distant">
    <Transition enter-from-class="opacity-0" enter-to-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="isActive" class="fixed inset-0 z-10 bg-black/50 backdrop-blur-xs duration-400" />
    </Transition>

    <Transition
      enter-from-class="opacity-0 modal-motion"
      enter-to-class="duration-400"
      leave-to-class="opacity-0 modal-motion duration-400"
      @after-enter="(el) => (el as HTMLDivElement).focus()"
    >
      <div
        v-if="isActive"
        role="dialog"
        class="fixed inset-0 z-10 flex overflow-auto p-4 outline-0 md:p-10"
        tabindex="0"
        @keydown.esc="onClose"
        @click.self="onClose"
      >
        <div class="modal-content m-auto w-full" :class="modalClass">
          <slot v-if="$slots.header || $slots.title" name="header">
            <div class="flex items-center p-4">
              <slot v-if="$slots.title" name="title" />

              <button type="button" class="ml-auto opacity-50 duration-200 hover:opacity-100" @click="onClose">
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
const { modalClass = 'max-w-xl' } = defineProps<{ modalClass?: string }>();

const emit = defineEmits<{ close: [] }>();

const isActive = ref(false);

let timeout: NodeJS.Timeout;

const onClose = () => {
  isActive.value = false;

  timeout = setTimeout(() => emit('close'), 300);
};

defineExpose({ onClose });

onMounted(() => (isActive.value = true));
onBeforeUnmount(() => clearTimeout(timeout));
</script>
