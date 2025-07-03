<template>
  <div class="relative">
    <div ref="reference" @click="isOpen = !isOpen">
      <slot name="trigger" :is-open="isOpen" />
    </div>

    <Teleport to="#teleports">
      <Transition
        enter-from-class="opacity-0 translate-y-2"
        enter-to-class="opacity-100 translate-y-0 duration-300"
        leave-to-class="opacity-0 translate-y-2 duration-300"
      >
        <div
          v-if="isOpen"
          ref="floating"
          :style="floatingStyles"
          :class="['dropdown-content', dropdownClass]"
          @click.stop
          @mouseleave="isOpen = !autoclose"
        >
          <div :class="['group dropdown-inner', dropdownInnerClass]">
            <slot />
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { useFloating, offset, shift, flip, size, autoUpdate } from '@floating-ui/vue';
import type { Placement } from '@floating-ui/vue';

const props = defineProps<{
  placement?: Extract<Placement, string>;
  autoclose?: boolean;
  dropdownClass?: string;
  dropdownInnerClass?: string;
}>();

const reference = useTemplateRef<HTMLDivElement>('reference');
const floating = useTemplateRef<HTMLDivElement>('floating');

const { floatingStyles } = useFloating(reference, floating, {
  placement: props.placement || 'bottom-start',
  middleware: [
    offset(8),
    shift({ crossAxis: true }),
    flip({ padding: 8 }),
    size({
      padding: 8,
      apply({ availableWidth, availableHeight, elements }) {
        Object.assign(elements.floating.style, {
          maxWidth: `${Math.max(100, availableWidth)}px`,
          maxHeight: `${Math.max(100, availableHeight)}px`
        });
      }
    })
  ],
  whileElementsMounted: autoUpdate
});

const isOpen = ref(false);

const onClickOutside = (event: MouseEvent) => {
  if (!isOpen.value || reference.value?.contains(event.target as Node)) return;

  isOpen.value = false;
};

onMounted(() => document.addEventListener('click', onClickOutside));
onBeforeUnmount(() => document.removeEventListener('click', onClickOutside));
</script>
