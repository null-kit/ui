<template>
  <Teleport to="#teleports" :disabled="inline">
    <Transition
      enter-from-class="opacity-0 translate-y-2"
      enter-to-class="duration-200"
      leave-to-class="opacity-0 translate-y-1 duration-200"
      :duration="200"
      @after-leave="$emit('close')"
    >
      <div
        v-if="isOpen"
        ref="floating"
        :class="['dropdown-content', dropdownClass]"
        :style="floatingStyles"
        @pointerleave="autoclose && (isOpen = false)"
        @click.stop
      >
        <div :class="['group dropdown-inner', innerClass]">
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { useFloating, offset, flip, size, autoUpdate, type Placement } from '@floating-ui/vue';

const emit = defineEmits<{ close: [] }>();

const props = defineProps<{
  reference: HTMLElement | null;
  placement?: Placement;
  dropdownClass?: string;
  innerClass?: string;
  maxHeight?: number;
  autoclose?: boolean;
  inline?: boolean;
}>();

const reference = toRef(props, 'reference');
const floating = useTemplateRef<HTMLDivElement>('floating');

const isOpen = useClickOutside(reference, floating);

const { floatingStyles } = useFloating(reference, floating, {
  whileElementsMounted: autoUpdate,
  placement: props.placement || 'bottom-start',
  middleware: [
    offset(8),
    flip({ padding: 8, fallbackStrategy: 'initialPlacement' }),
    size({
      padding: 8,
      apply({ availableWidth, availableHeight, elements }) {
        const height = Math.max(100, Math.min(availableHeight, props.maxHeight || availableHeight));

        elements.floating.style.setProperty('--floating-height', `${height}px`);

        Object.assign(elements.floating.style, {
          maxWidth: `${Math.max(100, availableWidth)}px`,
          maxHeight: `var(--floating-height)`
        });
      }
    })
  ]
});

defineExpose({ onClose: () => (isOpen.value = false) });

onMounted(() => (isOpen.value = true));
onUnmounted(() => (isOpen.value = false));
</script>
