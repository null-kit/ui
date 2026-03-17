---
title: Editor
description: Rich text editor input component
---

## Usage `FormEditor`

::note{to="https://tiptap.dev/docs"}
Component is built using `@tiptap/vue-3` under the hood.
::

::warning
To upload images, specify the API endpoint with the `path` prop where images will be processed.
::

<!-- prettier-ignore -->
```vue [index.vue]
<template>
  <FormEditor 
    v-model="article" 
    name="article" 
    placeholder="Enter Article" 
    path="/api/storage/wiki"
  />
</template>

<script setup lang="ts">
const article = ref();
</script>
```

## API

### Props

<!-- prettier-ignore -->
::field-group
  ::field{name="name" type="string" }
  Required if the field should show a validation message
  ::
  ::field{name="label" type="string" }
  ::
  ::field{name="placeholder" type="string" }
  ::
  ::field{name="required" type="boolean" }
  Displays a visual indicator if the field is required. Default `false`
  ::
  ::field{name="path" type="string" }
  API endpoint where images will be processed. Default method `POST`
  ::
::
