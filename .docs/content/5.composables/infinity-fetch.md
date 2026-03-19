---
title: Infinity Fetch
description: Infinite scrolling data fetch
---

## Usage `useInfinityFetch`

<!-- prettier-ignore -->
```vue [index.vue]
<template>
  <div ref="infinityScroll">
    <AppTable 
      v-if="data && data.length > 0" 
      :data 
      :columns 
      :virtual-scroll="40" 
      sticky-head 
      striped 
    />
  </div>
</template>

<script setup lang="ts">
const route = useRoute();

const { data, status } = useInfinityFetch<Users>('/api/users', { 
  el: useTemplateRef('infinityScroll'), 
  query: computed(() => ({
    perPage: route.query.perPage,
    sortBy: route.query.sortBy
  }))
});
</script>
```

## API

### `useInfinityFetch` arguments

<!-- prettier-ignore -->
::field-group
  ::field{name="el" type="ShallowRef<HTMLElement>" required}
  ::
  ::field{name="method" type="GET | POST"}
  Default `GET`
  ::
  ::field{name="query" type="MaybeRefOrGetter<SearchParameters>"}
  ::
  ::field{name="dataKey" type="string"}
  Key for nested data objects
  ::
::

### Returns

<!-- prettier-ignore -->
::field-group
  ::field{name="data" type="Ref<T>"}
  ::
  ::field{name="status" type="success | error | idle | pending"}
  ::
  ::field{name="refresh" type="function"}
  ::
  ::field{name="currentPage" type="number"}
  ::
::
