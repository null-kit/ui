---
title: Tabs
description: Navigation component for switching between content panels
---

## Usage `AppTabs`

```vue [index.vue]
<template>
  <AppTabs :tabs="['Best Cars', 'Regular Cars']">
    <template #best-cars>
      <p>Best Cars Content</p>
    </template>

    <template #regular-cars>
      <p>Regular Cars Content</p>
    </template>
  </AppTabs>
</template>
```

## API

### Props

<!-- prettier-ignore -->
::field-group
  ::field{name="tabs" type="string[]" required}
  ::
  ::field{name="tabsClass" type="string"}
  ::
  ::field{name="tabClass" type="string"}
  ::
  ::field{name="tabInnerClass" type="string"}
  ::
  ::field{name="activeClass" type="string"}
  ::
  ::field{name="defaultTab" type="string"}
  ::
  ::field{name="noQuery" type="boolean"}
::

### Slots

<!-- prettier-ignore -->
::field-group
  ::field{name="[key]" }
  Slot name is the slugified version of the tab name.<br>
  Exposes `isActive` for manually handling the active state.
::

## Examples

TBA
