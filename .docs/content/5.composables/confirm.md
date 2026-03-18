---
title: Confirm
description: Confirmation dialog before an action is performed
---

::note{to="/components/confirm"}
Look for inline approach using `AppConfirm`
::

## Usage `useConfirm`

```vue [index.vue]
<template>
  <button type="button" class="btn btn-danger" @click="onDeleteUser(user.id)">
    <AppIcon name="trash" />
  </button>
</template>

<script setup lang="ts">
const onDeleteUser = (id: number) => {
  useConfirm({
    message: `This action will delete user #${id}`,
    confirmText: 'Delete',
    onConfirm: () => console.info(`User #${id} Deleted Successfully`)
  });
};
</script>
```

## API

### `useConfirm`

<!-- prettier-ignore -->
::field-group
  ::field{name="message" type="string" required}
  ::
  ::field{name="title" type="string"}
  ::
  ::field{name="confirmText" type="string"}
  ::
  ::field{name="onConfirm" type="function"}
  ::
::
