---
title: Modal
description: A modal dialog component for displaying overlay content.
---

## Usage `AppModal`

```vue [index.vue]
<template>
  <AppModal v-if="modalOpen" @close="modalOpen = false">
    <template #title>How to build a starship</template>

    <ul>
      <li>Get advanced propulsion.</li>
      <li>Build a strong hull.</li>
    </ul>
  </AppModal>
</template>

<script setup lang="ts">
const modalOpen = ref(false);
</script>
```

## API

### Props

<!-- prettier-ignore -->
::field-group
  ::field{name="modal-class" type="string"}
  Default `max-w-xl`
  ::
  ::field{name="prevent-close" type="boolean"}
  Default `false`<br>
  Locks the modal until it is closed manually using the exposed `onClose` function.
  ::
  ::field{name="dismissible" type="boolean"}
  Default `false`<br>
  Allows the modal to be closed by clicking outside. 
::

### Slots

<!-- prettier-ignore -->
::field-group
  ::field{name="default"}
  ::
  ::field{name="header"}
  ::
  ::field{name="title"}
::

## Examples

TBA
