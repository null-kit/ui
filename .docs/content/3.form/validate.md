---
title: Validate
description: Component for displaying validation messages
---

## Usage `FormValidate`

::note
`FormValidate` is used inside each `Form` component, but is also available for manual handling.
::

```vue [index.vue]
<template>
  <FormValidate name="email" />
</template>

<script setup lang="ts">
const { setErrors } = useValidate();

const onSubmit = () => {
  setErrors({ email: 'Please enter a valid email address' });
};
</script>
```

## API

### Props

<!-- prettier-ignore -->
::field-group
  ::field{name="name" type="string" }
  ::
::
