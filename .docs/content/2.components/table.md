---
title: Table
description: TBA
---

## Usage `AppTable`

```vue [index.vue]
<template>
  <AppTable :data :columns />
</template>

<script setup lang="ts">
type Data = {
  id: number;
  title: string;
  description: string;
}

const data: Data = [
  {
    id: 1,
    title: 'Implement Authentication',
    description: 'Set up OAuth2 with JWT tokens'
  },
  {
    id: 2,
    title: 'Create Dashboard UI',
    description: 'Design and implement main dashboard'
  }
];

const columns: ColumnDef<Data>[] => [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'title', header: 'Title' },
  { accessorKey: 'description', header: 'Description' }
]
</script>
```

## API

### Props

<!-- prettier-ignore -->
::field-group
  ::field{name="data" type="T[]" required}
  ::
  ::field{name="columns" type="ColumnDef<T>[] | (columnHelper) => ColumnDef<T>[]" required}
  ::
  ::field{name="nestedKey" type="keyof T"}
  ::
  ::field{name="sort" type="server | client"}
  ::
  ::field{name="sortDefault" type="keyof T:(asc | desc)"}
  ::
  ::field{name="enableSorting" type="boolean"}
  ::
  ::field{name="virtualScroll" type="boolean | number"}
  ::
  ::field{name="stickyHead" type="boolean"}
  ::
  ::field{name="stickyScrollbar" type="boolean"}
  ::
  ::field{name="striped" type="boolean"}
::

### Slots

<!-- prettier-ignore -->
::field-group
  ::field{name="th-[key]-left" }
  ::
  ::field{name="th-[key]" }
  ::
  ::field{name="th-[key]-right" }
  ::
  ::field{name="[key]" }
  Exposes `cell | row | isNested`{lang="ts-type"}
  ::
  ::field{name="tf-[key]" }
  Exposes `values`{lang="ts-type"}
  ::
::

## Examples

TBA
