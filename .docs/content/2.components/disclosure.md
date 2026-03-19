---
title: Disclosure
description: Expandable section for showing and hiding content
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
  ::field{name="title-class" type="string" }
  ::
  ::field{name="summary-class" type="string" }
  ::
  ::field{name="content-class" type="string" }
  ::
  ::field{name="no-chevron" type="boolean" }
  ::
  ::field{name="no-toggle" type="boolean" }
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
