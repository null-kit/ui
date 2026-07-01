<template>
  <Teleport to="#teleports" :disabled="inline">
    <Transition
      enter-from-class="opacity-0 translate-y-2"
      enter-to-class="duration-200"
      leave-to-class="opacity-0 translate-y-1 duration-200"
      :duration="200"
      @after-enter="(el) => !noFocus && (el as HTMLDivElement).focus({ preventScroll: true })"
      @after-leave="$emit('close')"
    >
      <div
        v-if="isOpen"
        ref="floating"
        :class="['dropdown-content z-10', dropdownClass]"
        :style="floatingStyles"
        tabindex="0"
        @pointerenter="autoclose === 'delayed' ? onClearTimeout() : undefined"
        @pointerleave="autoclose === 'delayed' ? onCloseDelayed() : undefined"
        @click.stop
        @keydown.esc="onClose"
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
  autoclose?: boolean | 'delayed';
  noFocus?: boolean;
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
  if (props.autoclose !== 'delayed') return;

  clearTimeout(closeTimeout);
  closeTimeout = undefined;
};

const onClose = () => {
  isOpen.value = false;
};

const onCloseDelayed = () => {
  if (props.autoclose !== 'delayed') return onClose();

  onClearTimeout();
  closeTimeout = setTimeout(onClose, 500);
};

defineExpose({ onClose });

onMounted(() => (isOpen.value = true));

onBeforeUnmount(() => {
  onClearTimeout();
  onClose();
});
</script>
