---
title: Disclosure
description: TBA
---

## Usage `AppDisclosure`

```vue [index.vue]
<template>
  <AppDisclosure title="How to build a starship" icon="rocket">
    <ul>
      <li>Get advanced propulsion.</li>
      <li>Build a strong hull.</li>
    </ul>
  </AppDisclosure>
</template>
```

## API

### Props

<!-- prettier-ignore -->
::field-group
  ::field{name="open" type="boolean" }
  ::
  ::field{name="title" type="string" }
  ::
  ::field{name="titleClass" type="string" }
  ::
  ::field{name="summaryClass" type="string" }
  ::
  ::field{name="contentClass" type="string" }
  ::
  ::field{name="noChevron" type="boolean" }
  ::
  ::field{name="noToggle" type="boolean" }
  ::
  ::field{name="prefix" type="boolean" }
  ::
  ::field{name="icon" type="string" }
  ::
::

### Slots

<!-- prettier-ignore -->
::field-group
  ::field{name="default"}
  ::
  ::field{name="summary"}
  ::
  ::field{name="icon"}
  ::
::

## Examples

TBA
