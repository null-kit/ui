<template>
  <div v-if="!selector" @contextmenu="onContextMenu">
    <slot />
  </div>

  <Teleport to="#teleports">
    <Transition
      enter-from-class="opacity-0 skew-1 blur-xs"
      enter-to-class="duration-200"
      leave-to-class="opacity-0 -skew-1 blur-xs duration-200"
    >
      <div v-if="isOpen" :key="menuKey" ref="menuRef" class="dropdown-content fixed z-10" :class="dropdownClass">
        <slot name="menu" :target="targetElement" :on-close="onClose" />
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computePosition, flip, shift, offset } from '@floating-ui/dom';

const emit = defineEmits<{ open: [target: HTMLElement | null]; close: [] }>();

const { selector } = defineProps<{ selector?: string; dropdownClass?: string }>();

const isOpen = ref(false);

const menuKey = ref(0);

const menuRef = ref<HTMLElement | null>(null);

const targetElement = ref<HTMLElement | null>(null);

let virtualElement = {
  getBoundingClientRect: () => DOMRect.fromRect()
};

const hasTextSelection = () => {
  const selection = window.getSelection();

  return selection && !selection.isCollapsed;
};

const onUpdatePosition = async () => {
  if (!menuRef.value) return;

  const { x, y } = await computePosition(virtualElement, menuRef.value, {
    strategy: 'fixed',
    placement: 'bottom-start',
    middleware: [offset(4), flip(), shift({ padding: 8 })]
  });

  Object.assign(menuRef.value.style, {
    left: `${x}px`,
    top: `${y}px`
  });
};

const onOpen = async (event: MouseEvent, target?: HTMLElement | null) => {
  document.body.style.overflow = 'hidden';

  targetElement.value = target ?? null;

  virtualElement = {
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
      } as DOMRect;
    }
  };

  menuKey.value++;
  isOpen.value = true;

  emit('open', targetElement.value);

  await nextTick();
  await onUpdatePosition();
};

const onClose = () => {
  isOpen.value = false;
  document.body.removeAttribute('style');

  emit('close');
};

const onContextMenu = (event: MouseEvent) => {
  if (hasTextSelection()) return;

  event.preventDefault();
  onOpen(event);
};

const onSelectorContextMenu = (event: MouseEvent) => {
  if (!selector) return;

  if (hasTextSelection()) return;

  const target = (event.target as HTMLElement)?.closest(selector);

  if (!target) return;

  event.preventDefault();

  onOpen(event, target as HTMLElement);
};

const onClickOutside = (event: MouseEvent) => {
  if (!isOpen.value) return;

  const menu = menuRef.value;

  if (!menu) return;

  if (!menu.contains(event.target as Node)) {
    onClose();
  }
};

onMounted(() => {
  document.addEventListener('click', onClickOutside);

  if (selector) document.addEventListener('contextmenu', onSelectorContextMenu);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', onClickOutside);

  if (selector) document.removeEventListener('contextmenu', onSelectorContextMenu);
});
</script>
