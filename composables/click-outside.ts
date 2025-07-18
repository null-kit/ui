export const useClickOutside = (reference: Ref<HTMLElement | null>) => {
  const clickedOutside = ref(false);

  const onClick = (event: MouseEvent) => {
    if (!clickedOutside.value || reference.value?.contains(event.target as Node)) return;

    clickedOutside.value = false;
  };

  onMounted(() => document.addEventListener('click', onClick));

  onBeforeUnmount(() => document.removeEventListener('click', onClick));

  return clickedOutside;
};
