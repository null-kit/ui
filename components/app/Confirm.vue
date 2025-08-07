<template>
  <div ref="reference" class="w-fit" @click="isOpen = !isOpen">
    <slot />
  </div>

  <Teleport to="#teleports">
    <Transition name="confirm" :duration="400">
      <div v-if="isOpen" ref="floating" class="z-10" :style="floatingStyles" @click.stop>
        <div
          role="dialog"
          class="bg-darwin text-surface inverted flex gap-4 rounded-2xl p-4 shadow-lg"
          :class="hasPlacement(['bottom-start', 'bottom-end']) ? 'flex-col-reverse' : 'flex-col'"
        >
          <div>
            <div class="mb-1 flex items-center gap-2">
              <AppIcon name="confirm" class="size-5" />

              <div class="text-lg font-semibold">{{ title }}</div>
            </div>

            <slot name="message">
              <p>{{ message }}</p>
            </slot>
          </div>

          <div
            class="flex items-center gap-3 *:flex-1"
            :class="{ 'flex-row-reverse': hasPlacement(['top-end', 'bottom-end']) }"
          >
            <button type="button" class="btn" :class="confirmClass" @click="onConfirm">
              {{ confirmText }}
            </button>

            <button type="button" class="btn btn-default" @click="isOpen = false">Cancel</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { useFloating, offset, flip, size, autoUpdate } from '@floating-ui/vue';

const emit = defineEmits<{ confirm: [] }>();

withDefaults(
  defineProps<{
    title?: string;
    message?: string;
    confirmText?: string;
    confirmClass?: string;
  }>(),
  {
    title: 'Confirm',
    message: 'Are you sure?',
    confirmText: 'Confirm',
    confirmClass: 'btn-main'
  }
);

const reference = useTemplateRef<HTMLElement>('reference');
const floating = useTemplateRef<HTMLElement>('floating');

const { floatingStyles, middlewareData } = useFloating(reference, floating, {
  placement: 'top-start',
  middleware: [
    offset(({ rects }) => ({ mainAxis: -(16 + rects.reference.height), alignmentAxis: -16 })),
    flip(),
    size({
      padding: 8,
      apply({ availableWidth, elements }) {
        Object.assign(elements.floating.style, { maxWidth: `${Math.max(320, availableWidth)}px` });
      }
    })
  ],
  whileElementsMounted: autoUpdate
});

const isOpen = useClickOutside(reference);

const hasPlacement = (placements: string[]) => placements.includes(middlewareData.value.offset?.placement ?? '');

const onConfirm = () => {
  isOpen.value = false;

  emit('confirm');
};
</script>

<style>
.confirm-enter-active [role='dialog'],
.confirm-leave-active [role='dialog'] {
  transition: 0.4s cubic-bezier(0.83, 0, 0.17, 1);
  transition-property: transform, opacity, filter;
}

.confirm-enter-from [role='dialog'],
.confirm-leave-to [role='dialog'] {
  transform: perspective(500px) rotateX(20deg) skewY(5deg) translateY(30px);
  filter: blur(12px);
  opacity: 0;
}
</style>
