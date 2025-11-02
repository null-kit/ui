<template>
  <tfoot>
    <tr v-if="hasFooter" :class="meta.trClass">
      <td v-if="meta.expandedKey" class="w-0" />

      <td
        v-for="cell in cells"
        :key="cell"
        :class="[
          meta.tdClass,
          { 'left-0 md:sticky': meta.stickyLeft?.includes(cell) },
          { 'right-0 -left-px border-l md:sticky': meta.stickyRight?.includes(cell) }
        ]"
        :aria-label="`tf-${cell}`"
      >
        <component :is="slots[`tf-${cell}`]" v-if="slots[`tf-${cell}`]" :values="data.map((d) => d[cell])" />
      </td>

      <td v-if="slots.actions" :class="['w-0', meta.tdClass]" />
    </tr>

    <component v-if="slots.tfoot" :is="slots.tfoot" />
  </tfoot>
</template>

<script setup lang="ts" generic="T extends Record<string, unknown>">
const props = defineProps<{
  data: T[];
  cells: string[];

  meta: {
    trClass?: string;
    tdClass?: string;

    stickyLeft?: string[];
    stickyRight?: string[];

    dictionaryKey?: string;
    expandedKey?: string;
    virtual?: boolean;
  };

  slots: {
    tfoot?: object;
    actions?: object;
    [key: string]: object | undefined;
  };
}>();

const hasFooter = computed(() => Object.keys(props.slots).some((key) => key.startsWith('tf-')));
</script>
