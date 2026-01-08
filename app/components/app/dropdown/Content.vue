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
        v-if="isActive"
        ref="floating"
        :class="['dropdown-content', dropdownClass]"
        :style="floatingStyles"
        @pointerleave="autoclose && (isActive = false)"
      >
        <div :class="['group dropdown-inner', innerClass]">
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { Placement } from '@floating-ui/vue';
import { useFloating, offset, flip, size, autoUpdate } from '@floating-ui/vue';

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

const floating = useTemplateRef<HTMLDivElement>('floating');

const isActive = useClickOutside(toRef(props, 'reference'), floating);

const { floatingStyles } = useFloating(toRef(props, 'reference'), floating, {
  whileElementsMounted: autoUpdate,
  placement: props.placement || 'bottom-start',
  middleware: [
    offset(8),
    flip({ padding: 8 }),
    size({
      padding: 8,
      apply({ availableWidth, availableHeight, elements }) {
        const height = Math.max(100, Math.min(availableHeight, props.maxHeight || availableHeight));

        elements.floating.style.setProperty('--floating-height', `${height}px`);

        Object.assign(elements.floating.style, {
          maxWidth: `${Math.max(100, availableWidth)}px`,
          maxHeight: `${height}px`
        });
      }
    })
  ]
});

defineExpose({ onClose: () => (isActive.value = false) });

onMounted(() => (isActive.value = true));
onUnmounted(() => (isActive.value = false));
</script>
