<template>
  <span :class="['inline-flex min-w-0', hoverClass]" @pointerleave="isActive = false" @pointermove="onPointerMove">
    <slot>
      <AppIcon v-if="icon" :name="icon" :class="iconClass" />
      {{ trigger }}
    </slot>

    <Teleport to="#teleports" :disabled="!isMounted">
      <Transition
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-to-class="opacity-0"
        :duration="400"
        @after-leave="isMounted = false"
      >
        <div
          v-if="isActive"
          ref="floating"
          :style="floatingStyles"
          class="tooltip-content pointer-events-none z-10 transition-opacity"
          :class="$attrs.class"
        >
          <slot name="message">
            {{ message }}
          </slot>
        </div>
      </Transition>
    </Teleport>
  </span>
</template>

<script setup lang="ts">
import { autoPlacement, offset, shift, useFloating } from '@floating-ui/vue';
import type { VirtualElement } from '@floating-ui/vue';

defineOptions({ inheritAttrs: false });

defineProps<{
  trigger?: string;
  message?: string;
  hoverClass?: string;
  icon?: string;
  iconClass?: string;
}>();

const floating = useTemplateRef<HTMLDivElement>('floating');

const isActive = ref(false);
const isMounted = ref(false);

const virtualReference = shallowRef<VirtualElement>({
  getBoundingClientRect: () => ({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  })
});

const { floatingStyles, update } = useFloating(virtualReference, floating, {
  middleware: [offset(20), autoPlacement({ padding: 10 }), shift({ padding: 10 })]
});

let frame = 0;

const onPointerMove = (event: PointerEvent) => {
  if (frame && !isMounted.value) return;

  frame = requestAnimationFrame(() => {
    frame = 0;

    isActive.value = true;
    isMounted.value = true;

    virtualReference.value.getBoundingClientRect = () => ({
      width: 0,
      height: 0,
      x: event.clientX,
      y: event.clientY,
      top: event.clientY,
      left: event.clientX,
      right: event.clientX,
      bottom: event.clientY
    });

    if (isMounted.value) update();
  });
};
</script>
