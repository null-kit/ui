---
title: Bookmarks
description: Utilities for managing route bookmarks
---

## Usage `useBookmarks`

::warning
To initialize bookmarks, add `settings.bookmarks` inside `app.config.ts` <br>

<!-- prettier-ignore -->
```ts [app.config.ts]
export default defineAppConfig({
  settings: {
    bookmarks: [] // Array<{ label: string; url: string }>
  }
});

```

::

```vue [index.vue]
<template>
  <button type="button" class="btn" @click="toggleBookmark($route.path)">
    <AppIcon :name="isBookmarked ? 'unstar' : 'star" />
  </button>
</template>

<script setup lang="ts">
definePageMeta({ title: 'Users' });

const { toggleBookmark, isBookmarked } = useBookmarks();
</script>
```

## API

### `toggleBookmark`

::field{name="path" type="string"}

### `isBookmarked`

::field{type="boolean"}
