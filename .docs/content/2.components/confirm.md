---
title: Confirm
description: Confirmation dialog before an action is performed
---

## Usage `AppConfirm`

::note{to="https://floating-ui.com/docs/vue"}
Component is built using `@floating-ui/vue` under the hood.
::

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
  ::field{name="confirm-text" type="string"}
  Default `Confirm`
  ::
  ::field{name="confirm-class" type="string"}
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
