---
title: Click Outside
description: Handles click events outside of specified elements
---

## Usage `useClickOutside`

::tip
Originally created for `AppDropdown` and `AppConfirm`, but also available for other click-outside use cases
::

```vue [index.vue]
<template>
  <button ref="reference" type="button" class="btn">How to build a starship</button>

  <ul v-if="isOpen" ref="floating">
    <li>Get advanced propulsion.</li>
    <li>Build a strong hull.</li>
  </ul>
</template>

<script setup lang="ts">
const reference = useTemplate('reference');
const floating = useTemplate('floating');

const isOpen = useClickOutside(reference, floating);
</script>
```

## API

### `useClickOutside`

<!-- prettier-ignore -->
::field-group
  ::field{name="reference" type="Ref<HTMLElement>"}
  ::
  ::field{name="floating" type="Ref<HTMLElement>"}
  ::
::
