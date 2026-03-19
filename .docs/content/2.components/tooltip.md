---
title: Tooltip
description: Component for displaying contextual information on hover or focus
---

## Usage `AppTooltip`

::note{to="https://floating-ui.com/docs/vue"}
Component is built using `@floating-ui/vue` under the hood.
::

```vue [index.vue]
<template>
  <AppTooltip icon="help" message="Here is a helpful message" />
</template>
```

## API

### Props

<!-- prettier-ignore -->
::field-group
  ::field{name="trigger" type="string" }
  ::
  ::field{name="message" type="string"}
  ::
  ::field{name="hover-class" type="string"}
  ::
  ::field{name="icon" type="string"}
  ::  
  ::field{name="icon-class" type="string"}
  ::
::

### Slots

<!-- prettier-ignore -->
::field-group
  ::field{name="default"}
  ::
  ::field{name="message"}
  ::
::

## Examples

TBA
