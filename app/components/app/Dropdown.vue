<template>
  <div ref="reference" @click="onTriggerClick" @mouseenter="onTriggerEnter" @mouseleave="onTriggerLeave">
    <slot name="trigger" :is-open="isOpen" />

    <Teleport to="#teleports" :disabled="!isMounted">
      <Transition
        enter-from-class="opacity-0 translate-y-2"
        enter-to-class="duration-200"
        leave-to-class="opacity-0 translate-y-2 duration-200"
        :duration="200"
        @after-leave="isOpen = false"
      >
        <div
          v-if="isOpen"
          ref="floating"
          :class="['dropdown-content', dropdownClass]"
          :style="floatingStyles"
          @click.stop
          @mouseenter="onDropdownEnter"
          @mouseleave="onDropdownLeave"
        >
          <div :class="['group dropdown-inner', innerClass]">
            <slot :is-open="isOpen" />
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { useFloating, offset, flip, size, autoUpdate } from '@floating-ui/vue';
import type { Placement } from '@floating-ui/vue';

const emit = defineEmits<{ close: [] }>();

const props = defineProps<{
  placement?: Extract<Placement, string>;
  autoclose?: boolean;
  dropdownClass?: string;
  innerClass?: string;
  hoverOpen?: boolean;
  noToggle?: boolean;
  maxHeight?: number;
}>();

defineExpose({ onClose: () => (isOpen.value = false) });

const reference = useTemplateRef<HTMLDivElement>('reference');
const floating = useTemplateRef<HTMLDivElement>('floating');

const isOpen = useClickOutside(reference, floating);
const isMounted = ref(false);
const isHovering = ref(false);

const { floatingStyles } = useFloating(reference, floating, {
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
  ],
  whileElementsMounted: isOpen.value ? autoUpdate : undefined
});

const onTriggerClick = () => {
  if (props.noToggle && isOpen.value) return;
  isOpen.value = !isOpen.value;
};

const onTriggerEnter = () => {
  if (props.hoverOpen) isOpen.value = true;
};

const onTriggerLeave = () => {
  if (!props.hoverOpen) return;

  const debounced = debounce(() => {
    if (!isHovering.value) isOpen.value = false;
  }, 100);

  debounced();
};

const onDropdownEnter = () => {
  if (props.hoverOpen) {
    isHovering.value = true;
    isOpen.value = true;
  }
};

const onDropdownLeave = () => {
  if (props.hoverOpen) {
    isOpen.value = false;
  } else {
    isOpen.value = !props.autoclose;
  }
};

watch(isOpen, (value) => {
  if (!value) {
    isHovering.value = false;
    emit('close');
  }
});
</script>
