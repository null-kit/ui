<template>
  <div class="mb-4">
    <VisBulletLegend :items :on-legend-item-click />
  </div>
</template>

<script setup lang="ts" generic="T extends Record<string, unknown>">
import { VisBulletLegend } from '@unovis/vue';
import type { BulletLegendItemInterface } from '@unovis/ts';

const model = defineModel<Record<string, unknown>[]>({ required: true });

const props = defineProps<{
  categories: string[];
  colors: string[];
  data: T[];
  xIndexes: Set<number>;
}>();

let items = props.categories.map((item, index) => ({
  name: item,
  inactive: false,
  color: props.colors[index]
}));

const onLegendItemClick = (d: BulletLegendItemInterface, i: number) => {
  if (!items[i]) return;

  items = items.map((item, index) => (index === i ? { ...item, inactive: !item.inactive } : item));

  const hasInactiveItems = items.some((item) => item.inactive);

  if (!hasInactiveItems) {
    model.value = props.data;
    return;
  }

  model.value = props.data.map((item, index) => {
    const filteredItem = { ...item } as Record<string, unknown>;

    if (props.xIndexes.has(index)) {
      for (const category of props.categories) filteredItem[category] = 0;
    } else {
      for (const category of props.categories) {
        const cIndex = props.categories.indexOf(category);

        if (items[cIndex]?.inactive) filteredItem[category] = 0;
      }
    }

    return filteredItem;
  });
};
</script>
