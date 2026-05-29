<template>
  <Teleport to="#teleports">
    <Transition enter-from-class="opacity-0" leave-to-class="opacity-0">
      <div v-if="isActive" class="app-drawer-backdrop fixed inset-0 z-10" @click="onClose" />
    </Transition>

    <Transition
      enter-from-class="app-drawer-motion"
      enter-to-class="duration-400 ease-in-out"
      leave-to-class="app-drawer-motion duration-400 ease-in-out"
      :duration="400"
      @after-enter="(el) => (el as HTMLDivElement).focus()"
      @after-leave="$emit('close')"
    >
      <div
        v-if="isActive"
        class="app-drawer fixed z-10 outline-0"
        :data-placement="placement"
        tabindex="0"
        @keydown.esc="onClose"
      >
        <div class="app-drawer-content scrollbar app-drawer-overflow overflow-auto">
          <slot :on-close />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
defineEmits<{ close: [] }>();

const isActive = ref(false);

const { placement = 'bottom' } = defineProps<{
  placement?: 'bottom' | 'top' | 'left' | 'right';
}>();

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
