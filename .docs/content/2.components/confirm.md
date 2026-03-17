---
title: Confirm
description: TBA
---

## Usage `AppConfirm`

The `AppConfirm` component is built using `@floating-ui/vue` under the hood.

```vue [index.vue]
<template>
  <AppConfirm message="This action will send a load of money" @confirm="onSendMoney">
    <button type="button" class="btn btn-default">Send money</button>
  </AppConfirm>
</template>
```

## API

### Props

<!-- prettier-ignore -->
::field-group
  ::field{name="title" type="string"}
  Default `Confirm`
  ::
  ::field{name="message" type="string"}
  ::
  ::field{name="confirmText" type="string"}
  Default `Confirm`
  ::
  ::field{name="confirmClass" type="string"}
  Default `btn-danger`
  ::  
::

### Slots

<!-- prettier-ignore -->
::field-group
  ::field{name="default"}
::

## Examples

TBA
