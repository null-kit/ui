# FormTreeSelect Component

A Vue 3 component that provides hierarchical tree-structured selection with checkboxes, search functionality, and expandable/collapsible nodes. Supports multi-selection with parent-child relationship handling.

## Props

| Prop       | Type           | Required | Default | Description                       |
| ---------- | -------------- | -------- | ------- | --------------------------------- |
| `label`    | `string`       | No       | -       | Label text for the tree select    |
| `name`     | `string`       | Yes      | -       | Field name for validation         |
| `options`  | `TreeOption[]` | Yes      | -       | Array of tree options             |
| `child`    | `boolean`      | No       | `false` | Whether this is a child component |
| `search`   | `boolean`      | No       | `false` | Enable search functionality       |
| `required` | `boolean`      | No       | `false` | Mark field as required            |

## Model

| Property | Type       | Description                     |
| -------- | ---------- | ------------------------------- |
| `model`  | `string[]` | Array of selected option values |

## Types

```typescript
type TreeOption = {
  value: string;
  name: string;
  children?: TreeOption[];
  isOpen?: boolean;
};
```

## Features

### Tree Structure

- **Hierarchical Data**: Supports nested tree structures with unlimited depth
- **Expandable Nodes**: Click to expand/collapse parent nodes
- **Visual Indicators**: Arrow icons show expand/collapse state
- **Indentation**: Visual hierarchy with dashed borders

### Selection System

- **Multi-Selection**: Select multiple items with checkboxes
- **Parent-Child Logic**: Selecting parent selects all children
- **Indeterminate State**: Shows when some but not all children are selected
- **Cascading Selection**: Unselecting parent unselects all children

### Search Functionality

- **Real-time Search**: Filter options as you type
- **Hierarchical Search**: Search through parent and child nodes
- **Sticky Search Bar**: Search input stays at top during scroll
- **No Results State**: Shows when no options match search

### User Experience

- **Scrollable Container**: Handles large option lists
- **Visual Feedback**: Hover states and cursor changes
- **Keyboard Accessible**: Proper focus management
- **Validation Integration**: Works with form validation system

## Usage Examples

### Basic Tree Select

```vue
<template>
  <FormTreeSelect v-model="selectedCategories" name="categories" label="Select Categories" :options="categoryOptions" />
</template>

<script setup>
const selectedCategories = ref([]);

const categoryOptions = [
  {
    value: 'electronics',
    name: 'Electronics',
    children: [
      { value: 'phones', name: 'Phones' },
      { value: 'laptops', name: 'Laptops' },
      { value: 'tablets', name: 'Tablets' }
    ]
  },
  {
    value: 'clothing',
    name: 'Clothing',
    children: [
      { value: 'shirts', name: 'Shirts' },
      { value: 'pants', name: 'Pants' },
      { value: 'shoes', name: 'Shoes' }
    ]
  },
  { value: 'books', name: 'Books' }
];
</script>
```

### Deep Nested Structure

```vue
<template>
  <FormTreeSelect
    v-model="selectedRegions"
    name="regions"
    label="Select Regions"
    :options="regionOptions"
    search
    required
  />
</template>

<script setup>
const selectedRegions = ref([]);

const regionOptions = [
  {
    value: 'north-america',
    name: 'North America',
    children: [
      {
        value: 'usa',
        name: 'United States',
        children: [
          { value: 'california', name: 'California' },
          { value: 'new-york', name: 'New York' },
          { value: 'texas', name: 'Texas' }
        ]
      },
      {
        value: 'canada',
        name: 'Canada',
        children: [
          { value: 'ontario', name: 'Ontario' },
          { value: 'quebec', name: 'Quebec' }
        ]
      }
    ]
  },
  {
    value: 'europe',
    name: 'Europe',
    children: [
      { value: 'france', name: 'France' },
      { value: 'germany', name: 'Germany' },
      { value: 'spain', name: 'Spain' }
    ]
  }
];
</script>
```

### Dynamic Options

```vue
<template>
  <FormTreeSelect
    v-model="selectedPermissions"
    name="permissions"
    label="User Permissions"
    :options="permissionOptions"
    search
  />
</template>

<script setup>
const selectedPermissions = ref([]);

const permissionOptions = computed(() => {
  return [
    {
      value: 'admin',
      name: 'Administrator',
      children: [
        { value: 'user-management', name: 'User Management' },
        { value: 'system-settings', name: 'System Settings' }
      ]
    },
    {
      value: 'editor',
      name: 'Editor',
      children: [
        { value: 'content-edit', name: 'Content Edit' },
        { value: 'media-upload', name: 'Media Upload' }
      ]
    },
    {
      value: 'viewer',
      name: 'Viewer',
      children: [
        { value: 'content-view', name: 'Content View' },
        { value: 'reports-view', name: 'Reports View' }
      ]
    }
  ];
});

// Watch for changes
watch(selectedPermissions, (newPermissions) => {
  console.log('Permissions changed:', newPermissions);
});
</script>
```

## Technical Details

## Dependencies

- **FormCheck**: For checkbox functionality
- **FormValidate**: For validation display
