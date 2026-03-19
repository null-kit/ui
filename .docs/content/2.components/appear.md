---
title: Appear
description: Appear animation component for smoothly revealing content
---

## Usage `AppAppear`

```vue [index.vue]
<template>
  <AppAppear v-if="isActive">
    <AppAlert type="warning" label="Please pay attention" />
  </AppAppear>
</template>

<script setup lang="ts">
const isActive = ref(false);
</script>
```

## API

### Props

<!-- prettier-ignore -->
::field-group
  ::field{name="no-appear" type="boolean" }
  Disables the appear animation. Default `false`
  ::
::

### Slots

<!-- prettier-ignore -->
::field-group
  ::field{name="default"}
  ::
::

## Examples

TBA
