---
title: Drawer
description: Drawer dialog component for displaying overlay content
---

## Usage `AppDrawer`

```vue [index.vue]
<template>
  <AppDrawer v-if="drawerOpen" @close="drawerOpen = false">
    <p>How to build a starship</p>

    <ul>
      <li>Get advanced propulsion.</li>
      <li>Build a strong hull.</li>
    </ul>
  </AppDrawer>
</template>

<script setup lang="ts">
const drawerOpen = ref(false);
</script>
```

## API

### Slots

<!-- prettier-ignore -->
::field-group
  ::field{name="default"}
::

## Examples

TBA
