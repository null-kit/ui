<template>
  <span
    ref="reference"
    :class="['min-w-0', hoverClass]"
    @pointerleave="isActive = false"
    @pointermove="onPointerMove"
    @click="isActive = true"
  >
    <slot>
      <AppIcon v-if="icon" :name="icon" :class="iconClass" />
      {{ trigger }}
    </slot>

    <Teleport to="#teleports">
      <Transition enter-from-class="opacity-0" enter-to-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="isActive" ref="floating" :style="floatingStyles" class="z-10 transition-opacity">
          <div class="tooltip-content" :class="$attrs.class">
            <slot name="message">
              {{ message }}
            </slot>
          </div>
        </div>
      </Transition>
    </Teleport>
  </span>
</template>

<script setup lang="ts">
import { autoPlacement, offset, shift, useFloating } from '@floating-ui/vue';

defineOptions({ inheritAttrs: false });

defineProps<{
  trigger?: string;
  message?: string;
  hoverClass?: string;
  icon?: string;
  iconClass?: string;
}>();

const reference = useTemplateRef<HTMLDivElement>('reference');
const floating = useTemplateRef<HTMLDivElement>('floating');

const isActive = ref(false);

const { floatingStyles, update } = useFloating(reference, floating, {
  middleware: [offset(20), autoPlacement({ padding: 10 }), shift({ padding: 10 })]
});

const onPointerMove = (event: PointerEvent) => {
  if (!reference.value) return;

  isActive.value = true;

  Object.assign(reference.value, {
    getBoundingClientRect() {
      return {
        width: 0,
        height: 0,
        x: event.clientX,
        y: event.clientY,
        top: event.clientY,
        left: event.clientX,
        right: event.clientX,
        bottom: event.clientY
      };
    }
  });

  update();
};
</script>
