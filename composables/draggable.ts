export const useDraggable = <T extends string | number>(list: T[], preserveKey?: string) => {
  const { setItem } = useLocalStorage();
  const { settings } = useAppConfig();

  const dragIndex = ref<number | null>(null);

  const preservedList = preserveKey ? (settings[preserveKey] as T[]) : null;

  const orderedList = ref<T[]>(preservedList || list);

  const onDragStart = (event: DragEvent, index: number) => {
    dragIndex.value = index;

    if (event.target instanceof HTMLElement && event.dataTransfer) {
      const card = event.target.closest<HTMLElement>('[data-drag]');

      if (card) {
        event.dataTransfer.setDragImage(card, event.layerX, event.layerY);
        card.style.opacity = '0.5';
      }
    }
  };

  const onDragEnd = (event?: DragEvent) => {
    if (event?.target instanceof HTMLElement) {
      event.target.closest<HTMLElement>('[data-drag]')?.removeAttribute('style');
    }

    dragIndex.value = null;
  };

  const onDrop = (index: number) => {
    if (dragIndex.value === null) return;

    const draggedItem = orderedList.value[dragIndex.value];

    if (draggedItem) {
      orderedList.value.splice(dragIndex.value, 1);
      orderedList.value.splice(index, 0, draggedItem);
    }

    if (preserveKey) setItem(settings.key, { ...settings, [preserveKey]: orderedList.value });

    onDragEnd();
  };

  return {
    orderedList,
    onDragStart,
    onDragEnd,
    onDrop
  };
};
