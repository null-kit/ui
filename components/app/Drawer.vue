<template>
  <Teleport to="#teleports">
    <Transition enter-from-class="opacity-0" leave-to-class="opacity-0">
      <div v-if="isActive" class="fixed inset-0 z-10 bg-black/50 backdrop-blur-xs duration-400" @click="onClose" />
    </Transition>

    <Transition
      enter-from-class="translate-y-full"
      enter-to-class="duration-400 ease-in-out"
      leave-to-class="translate-y-full duration-400"
      :duration="400"
      @after-enter="(el) => (el as HTMLDivElement).focus()"
      @after-leave="$emit('close')"
    >
      <div v-if="isActive" class="fixed inset-x-2 bottom-0 z-10 outline-0" tabindex="0" @keydown.esc="onClose">
        <div class="drawer-content max-h-[calc(100dvh-3rem)] overflow-y-auto">
          <div class="drawer-overflow pointer-events-none sticky top-0 z-1 w-full bg-linear-0 to-current" />

          <div class="flex items-start justify-center gap-8">
            <slot />
          </div>

          <div class="drawer-overflow pointer-events-none sticky bottom-0 z-1 w-full bg-linear-0 from-current" />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
defineEmits<{ close: [] }>();

const isActive = ref(false);

const onClose = () => {
  isActive.value = false;
  document.body.removeAttribute('style');
};

defineExpose({ onClose });

onMounted(() => {
  isActive.value = true;
  document.body.style.overflow = 'hidden';
});
</script>
