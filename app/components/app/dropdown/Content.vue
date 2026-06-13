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
        :class="['dropdown-content z-10', dropdownClass]"
        :style="floatingStyles"
        @pointerenter="onClearTimeout"
        @pointerleave="autoclose ? onClose() : undefined"
        @click.stop
      >
        <div :class="['group dropdown-inner', innerClass]">
          <slot />
        </div>

        <div v-if="inline" class="absolute -inset-2 -z-1" />
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { useFloating, offset, flip, size, autoUpdate } from '@floating-ui/vue';
import type { Placement } from '@floating-ui/vue';

defineEmits<{ close: [] }>();

const props = defineProps<{
  reference: HTMLElement | null;
  placement?: Placement;
  dropdownClass?: string;
  innerClass?: string;
  maxHeight?: number;
  autoclose?: boolean | 'instant';
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

let closeTimeout: ReturnType<typeof setTimeout> | undefined;

const onClearTimeout = () => {
  if (props.autoclose === 'instant') return;

  clearTimeout(closeTimeout);
  closeTimeout = undefined;
};

const onClose = () => {
  if (props.autoclose === 'instant') {
    isOpen.value = false;
    return;
  }

  onClearTimeout();
  closeTimeout = setTimeout(() => (isOpen.value = false), 500);
};

defineExpose({ onClose });

onMounted(() => (isOpen.value = true));

onBeforeUnmount(() => {
  onClearTimeout();
  isOpen.value = false;
});
</script>
