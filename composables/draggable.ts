export const useDraggable = (order: (Record<string, unknown> | string | number)[]) => {
  const dragIndex = ref<number | null>(null);

  const onDragStart = (event: DragEvent, index: number) => {
    dragIndex.value = index;

    if (event.target instanceof HTMLElement && event.dataTransfer) {
      const card = event.target.closest('[data-drag]');

      if (card) {
        event.dataTransfer.setDragImage(card, 20, 20);
        card.classList.add('opacity-50');
      }
    }
  };

  const onDrop = (index: number) => {
    if (dragIndex.value === null) return;

    const draggedItem = order[dragIndex.value];

    if (draggedItem) {
      order.splice(dragIndex.value, 1);
      order.splice(index, 0, draggedItem);
    }

    document.querySelector('[data-drag].opacity-50')?.classList.remove('opacity-50');

    dragIndex.value = null;
  };

  return {
    onDragStart,
    onDrop
  };
};
