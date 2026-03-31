---
title: Control
description: Universal control component covering input, textarea, and select
---

## Usage `FormControl`

<!-- prettier-ignore -->
```vue [index.vue]
<template>
  <FormControl 
    v-model="email" 
    name="email" 
    label="Email" 
    placeholder="Enter your email" 
  />
</template>

<script setup lang="ts">
const email = ref('');
</script>
```

## API

### Model

::field{name="spaceToComma" type="modifier" }
Converts spaces to commas
::

### Props

<!-- prettier-ignore -->
::field-group
  ::field{name="name" type="string" }
  Required if the field should show a validation message
  ::
  ::field{name="type" type="text | password | email | number | textarea | select" }
  Default `text`
  ::
  ::field{name="label" type="string" }
  ::
  ::field{name="placeholder" type="string" }
  ::
  ::field{name="required" type="boolean" }
  Displays a visual indicator if the field is required. Default `false`
  ::
  ::field{name="autocomplete" type="string" }
  ::  
  ::field{name="autofocus" type="boolean" }
  ::
  ::field{name="help" type="string" }
  Displays the help message. Default: `undefined`
  ::
  ::field{name="disabled" type="boolean" }
  ::
  ::field{name="accept" type="string" }
  ::
  ::field{name="pattern" type="string" }
  ::
  ::field{name="step" type="string" }
  ::  
  ::field{name="min" type="string | number" }
  ::
  ::field{name="max" type="string | number" }
  ::  
  ::field{name="value" type="string | number | null" }
  ::  
  ::field{name="input-class" type="string" }
  ::  
  ::field{name="validate-class" type="string" }
  ::
::

### Slots

<!-- prettier-ignore -->
::field-group
  ::field{name="label-left"}
  ::
  ::field{name="label-right"}
  ::
  ::field{name="left"}
  ::
  ::field{name="right"}
  ::
  ::field{name="help"}
  ::
::

## Examples

TBA
