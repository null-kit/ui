---
title: Icon
description: SVG icon component for displaying custom icons.
---

## Usage `AppIcon`

```vue [index.vue]
<template>
  <AppIcon name="rocket" />
</template>
```

Icons should be stored insde `@/assets/img/svg` folder

```bash
app
└── assets
│   └── css
│   └── img/svg
│       ├── rocket.svg
│       ├── star.svg
│       ├── check.svg
│       └── alert.svg
├── components
└── composables
```

## API

### Props

<!-- prettier-ignore -->
::field-group
  ::field{name="name" type="string" required}
  Name of the SVG icon file
  ::
  ::field{name="inline" type="boolean"}
  Render raw SVG code
  ::
::

## Examples

TBA
