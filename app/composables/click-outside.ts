export const useClickOutside = (reference: Ref<HTMLElement | null>, floating?: Ref<HTMLElement | null>) => {
  const clickedOutside = ref(false);

  const onClick = (event: MouseEvent) => {
    if (!clickedOutside.value) return;

    const isInsideReference = reference.value?.contains(event.target as Node);
    const isInsideFloating = floating?.value?.contains(event.target as Node);

    if (isInsideReference || isInsideFloating) return;

    clickedOutside.value = false;
  };

  onMounted(() => document.addEventListener('click', onClick));

  onBeforeUnmount(() => document.removeEventListener('click', onClick));

  return clickedOutside;
};
