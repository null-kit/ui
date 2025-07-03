<template>
  <Teleport to="#teleports">
    <Transition
      enter-from-class="opacity-0"
      enter-to-class="opacity-100 duration-300"
      leave-to-class="opacity-0 duration-300"
      @after-enter="(el) => (el as HTMLDivElement).focus()"
      @after-leave="isActive = false"
    >
      <div
        v-if="isActive"
        class="fixed inset-0 z-10 flex overflow-auto bg-black/50 p-4 outline-0 backdrop-blur-xs md:p-10"
        tabindex="0"
        @keydown.esc="onClose"
      >
        <Transition
          appear-from-class="scale-98 translate-y-5"
          appear-to-class="scale-100 translate-y-0 duration-300"
          appear
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
        </Transition>
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
