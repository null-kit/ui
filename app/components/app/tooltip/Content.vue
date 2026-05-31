<template>
  <Teleport to="#teleports">
    <Transition enter-from-class="opacity-0" enter-to-class="transition-opacity" appear>
      <div ref="floating" :style="floatingStyles" class="app-tooltip z-10" :class="$attrs.class">
        <slot />

        <div
          v-if="placement !== 'left' && placement !== 'right'"
          ref="floatingArrow"
          class="app-tooltip-arrow"
          :data-placement="middlewareData.offset?.placement ?? 'top'"
          :style="{
            position: 'absolute',
            left: middlewareData.arrow?.x != null ? `${middlewareData.arrow.x}px` : ''
          }"
        />
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { useFloating, offset, shift, flip, autoUpdate, arrow } from '@floating-ui/vue';
import type { VirtualElement, Placement } from '@floating-ui/vue';

defineOptions({ inheritAttrs: false });
defineEmits<{ close: [] }>();

const props = defineProps<{
  reference: HTMLElement | null;
  noFollow?: boolean;
  placement?: Placement;
}>();

const anchor = toRef(props, 'reference');

const cursor = shallowRef<VirtualElement>({
  getBoundingClientRect: () => ({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
    top: -1000,
    left: -1000,
    right: 0,
    bottom: 0
  })
});

const floatingReference = computed(() => (props.noFollow ? anchor.value : cursor.value));

const floating = useTemplateRef<HTMLElement>('floating');
const floatingArrow = useTemplateRef<HTMLElement>('floatingArrow');

const padding = props.noFollow ? 8 : 16;

const { floatingStyles, update, middlewareData } = useFloating(floatingReference, floating, {
  placement: props.placement ?? 'top',
  middleware: [offset(padding), flip({ padding }), shift({ padding }), arrow({ element: floatingArrow, padding: 3 })],
  ...(props.noFollow ? { whileElementsMounted: autoUpdate } : {})
});

const onPointerMove = (event: PointerEvent) => {
  if (props.noFollow) return;

  cursor.value.getBoundingClientRect = () => ({
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

defineExpose({ onPointerMove });
</script>
