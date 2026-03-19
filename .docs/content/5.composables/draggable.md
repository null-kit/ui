---
title: Draggable
description: Drag-and-drop reordering of lists, with optional persistent state
---

## Usage `useDraggable`

::warning
To preserve the order of the list, add `settings.fruits` inside `app.config.ts`

<!-- prettier-ignore -->
```ts [app.config.ts]
export default defineAppConfig({
  settings: {
    shop: {
      fruits: []
    }
  }
});

```

::

<!-- prettier-ignore -->
```vue [index.vue]
<template>
  <div 
    v-for="(key, index) in orderedList" 
    :key 
    data-drag 
    @dragover.prevent 
    @drop="onDrop(index)"
  >
    <h2>{{ key }}</h2>

    <button 
      type="button" 
      draggable="true" 
      @dragstart="onDragStart($event, index)" 
      @dragend="onDragEnd"
    >
      <AppIcon name="drag" class="cursor-move" />
    </button>
  </div>
</template>

<script setup lang="ts">
const { setting } = useAppConfig();

const fruits = ['Apple', 'Banana', 'Orange', 'Grape', 'Kiwi'];

const { orderedList, onDragStart, onDrop, onDragEnd } = useDraggable(
  fruits, 
  settings.shop.fruits // Required for state preserving
);
</script>
```

## API

### `useDraggable` arguments

<!-- prettier-ignore -->
::field-group
  ::field{name="list" type="T[]" required}
  ::
  ::field{name="preserveKey" type="string | string[]"}
  ::
::

### `orderedList`

::field{type="Ref<T[]>"}

### `onDragStart`

<!-- prettier-ignore -->
::field-group
  ::field{name="event" type="DragEvent" required}
  ::
  ::field{name="index" type="number" required}
  ::
::

### `onDrop`

::field{name="index" type="number"}

### `onDragEnd`

::field{name="event" type="DragEvent" required}
