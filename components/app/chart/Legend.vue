<template>
  <VisBulletLegend :items :on-legend-item-click="onLegendItemClick" />
</template>

<script setup lang="ts">
import { VisBulletLegend } from '@unovis/vue';
import type { BulletLegendItemInterface } from '@unovis/ts';

const props = defineProps<{
  data: Record<string, number[]>[];
  categories: string[];
  colors: string[];
}>();

const model = defineModel<{ data: Record<string, number[]>[]; categories: string[] }>({ required: true });

const items = ref(
  props.categories.map((item, index) => ({
    name: useDictionary(item),
    label: item,
    inactive: false,
    color: props.colors[index]
  }))
);

onMounted(() => {
  model.value.data = props.data;
  model.value.categories = props.categories;
});

const activeCategories = computed(() => items.value.filter((item) => !item.inactive).map((item) => item.label));

const onLegendItemClick = (item: BulletLegendItemInterface, i: number) => {
  items.value[i]!.inactive = !items.value[i]!.inactive;

  const inactives = items.value.filter((item) => item.inactive).map((item) => item.label);

  model.value = {
    data: props.data.map((d) => {
      const newData = { ...d };

      for (const category of inactives) newData[category] = [0];

      return newData;
    }),
    categories: activeCategories.value
  };
};
</script>
