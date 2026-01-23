<template>
  <Teleport to="#teleports">
    <Transition
      name="confirm"
      :duration="300"
      @after-leave="isConfirmed ? $emit('confirm') : $emit('close')"
      @after-enter="(el) => (el as HTMLDivElement).focus()"
    >
      <div
        v-if="isOpen"
        ref="floating"
        tabindex="0"
        class="z-10 outline-0"
        :style="floatingStyles"
        @click.stop
        @keydown.esc="isOpen = false"
      >
        <div
          role="dialog"
          class="bg-darwin text-surface inverted flex gap-3 rounded-2xl p-3 shadow-lg"
          :class="hasPlacement(['bottom-start', 'bottom-end']) ? 'flex-col-reverse' : 'flex-col'"
        >
          <div>
            <div class="flex items-center gap-2">
              <AppIcon name="alert" class="size-5" />

              <div class="font-semibold">{{ title }}</div>
            </div>

            <slot name="message">
              <p class="text-sm whitespace-break-spaces">{{ message }}</p>
            </slot>
          </div>

          <div
            class="flex items-center gap-3 *:flex-1"
            :class="{ 'flex-row-reverse': hasPlacement(['top-end', 'bottom-end']) }"
          >
            <button
              type="button"
              class="btn"
              :class="confirmClass"
              @click="
                isConfirmed = true;
                isOpen = false;
              "
            >
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

const emit = defineEmits<{ close: []; confirm: [] }>();

const props = defineProps<{
  title?: string;
  message?: string;
  confirmText?: string;
  confirmClass?: string;
  reference: HTMLElement | null;
}>();

const reference = toRef(props, 'reference');
const floating = useTemplateRef<HTMLElement>('floating');

const isOpen = useClickOutside(reference);
const isConfirmed = ref(false);

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

const hasPlacement = (placements: string[]) => placements.includes(middlewareData.value.offset?.placement ?? '');

onMounted(() => {
  isOpen.value = true;
  isConfirmed.value = false;
});

onUnmounted(() => {
  isOpen.value = false;
  isConfirmed.value = false;
});
</script>

<style scoped>
.confirm-enter-active [role='dialog'],
.confirm-leave-active [role='dialog'] {
  transition: 0.3s cubic-bezier(0.83, 0, 0.17, 1);
  transition-property: transform, opacity, filter;
}

.confirm-enter-from [role='dialog'],
.confirm-leave-to [role='dialog'] {
  transform: perspective(500px) rotateX(20deg) skewY(5deg) translateY(30px);
  filter: blur(6px);
  opacity: 0;
}
</style>
