<template>
  <div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { SearchParameters } from 'ofetch';

const props = defineProps<{
  url?: string;
  query?: MaybeRefOrGetter<SearchParameters> | undefined;
}>();

onMounted(() => {
  if (props.url) {
    const { data, status, refresh } = useInfinityFetch(props.url, { query: props.query });
  }
});
</script>
