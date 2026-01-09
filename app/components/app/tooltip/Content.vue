<template>
  <Teleport to="#teleports">
    <Transition
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-to-class="opacity-0"
      class="transition-opacity"
      :duration="150"
      @after-leave="$emit('close')"
    >
      <div
        v-if="isActive"
        ref="floating"
        :style="floatingStyles"
        class="tooltip-content pointer-events-none z-10"
        :class="$attrs.class"
      >
        <slot />
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { useFloating, offset, shift, autoPlacement } from '@floating-ui/vue';
import type { VirtualElement } from '@floating-ui/vue';

defineOptions({ inheritAttrs: false });
defineEmits<{ close: [] }>();
defineProps<{ contentClass?: string }>();

const isActive = ref(false);

const reference = shallowRef<VirtualElement>({
  getBoundingClientRect: () => ({
    width: 0,
    height: 0,
    x: -1000,
    y: -1000,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  })
});

const floating = useTemplateRef<HTMLElement>('floating');

const { floatingStyles, update } = useFloating(reference, floating, {
  middleware: [offset(20), autoPlacement({ padding: 10 }), shift({ padding: 10 })]
});

const onPointerMove = (event: PointerEvent) => {
  reference.value.getBoundingClientRect = () => ({
    width: 0,
    height: 0,
    x: event.clientX,
    y: event.clientY,
    top: event.clientY,
    left: event.clientX,
    right: event.clientX,
    bottom: event.clientY
  });

  update();
};

defineExpose({
  onPointerMove,
  onPointerLeave: () => (isActive.value = false)
});

onMounted(() => (isActive.value = true));
onUnmounted(() => (isActive.value = false));
</script>
