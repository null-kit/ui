---
title: Toast
description: Displays toast notifications
---

## Usage `useToast`

```vue [index.vue]
<script setup lang="ts">
const { setToast } = useToast();

const onDeleteUser = (id: number) => {
  setToast({
    title: 'Success!',
    text: `User #${id} deleted successfully!`,
    type: 'success'
  });
};
</script>
```

## API

### `useToast` arguments

<!-- prettier-ignore -->
::field-group
  ::field{name="title" type="string"}
  ::
  ::field{name="text" type="string"}
  ::
  ::field{name="type" type="success | error | info | default"}
  ::
  ::field{name="manualClose" type="boolean"}
  Prevents autoclosing after 3s
  ::
  ::field{name="slot" type="VNode"}
  Pass custom elements with hyperscript `h()`.
  ::
::
