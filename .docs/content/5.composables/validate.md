---
title: Validate
description: Displays validation messages
---

## Usage `useValidate`

::tip
Send validation messages to the `FormValidate` component, which is included in every `Form` component.
::

```vue [index.vue]
<template>
  <form>
    <FormControl name="name" />
    <FormControl name="email" />
  </form>
</template>

<script setup lang="ts">
const { setErrors, clearErrors } = useValidate();

setErrors({
  name: 'Name is too long (max 50 characters)',
  email: 'Please enter a valid email'
});
</script>
```

## API

### `setErrors`

::field{name="errors" type="Record<string, string>" required}

### `clearErrors`

::field{name="path" type="string"}
If `path` is not specified, all errors will be cleared
::

### `errors`

::field{type="Record<string, string>"}
Get a list of current errors
::
