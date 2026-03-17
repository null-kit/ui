---
title: Dropdown
description: TBA
---

## Usage `AppDropdown`

::note{to="https://floating-ui.com/docs/vue"}
Component is built using `@floating-ui/vue` under the hood.
::

```vue [index.vue]
<template>
  <AppDropdown>
    <template #trigger>
      <button type="button">How to build a starship</button>
    </template>

    <ul>
      <li>Get advanced propulsion.</li>
      <li>Build a strong hull.</li>
    </ul>
  </AppDropdown>
</template>
```

## API

### Props

<!-- prettier-ignore -->
::field-group
  ::field{name="placement" type="top | right | bottom | left | (top | bottom | right | left)-(start | end)" }
  Default `bottom-start`
  ::
  ::field{name="dropdown-class" type="string"}
  ::
  ::field{name="inner-class" type="string"}
  ::
  ::field{name="max-height" type="number"}
  ::
  ::field{name="autoclose" type="boolean"}
  ::  
  ::field{name="inline" type="boolean"}
  :: 
  ::field{name="hover-open" type="boolean"}
  :: 
  ::field{name="no-toggle" type="boolean"}
  ::
::

### Slots

<!-- prettier-ignore -->
::field-group
  ::field{name="default"}
  Exposes `onClose` for manually closing
  ::
  ::field{name="trigger"}
  Exposes `isOpen` for manually handling the open state
  ::
::

## Examples

TBA
