# AppTable Component

A flexible table component with sorting, sticky headers, custom cell rendering, and responsive design. Supports dynamic columns, custom slots for cell content, and URL-based sorting state.

## Props

| Prop           | Type      | Default   | Description                                   |
| -------------- | --------- | --------- | --------------------------------------------- |
| `columns`      | `T[]`     | -         | Array of data objects for table rows          |
| `columnsExtra` | `string`  | -         | Comma-separated extra column keys to add      |
| `stickyHead`   | `boolean` | `false`   | Whether to make the header sticky             |
| `stickyOffset` | `string`  | `'top-0'` | CSS class for sticky header positioning       |
| `stickyCells`  | `string`  | -         | Comma-separated column keys to make sticky    |
| `sortBy`       | `string`  | -         | Comma-separated column keys that are sortable |
| `trClass`      | `string`  | -         | Additional CSS classes for table rows         |
| `thClass`      | `string`  | -         | Additional CSS classes for table headers      |
| `tdClass`      | `string`  | -         | Additional CSS classes for table cells        |
| `omit`         | `string`  | -         | Comma-separated column keys to hide           |

## Slots

| Slot       | Props                             | Description                             |
| ---------- | --------------------------------- | --------------------------------------- |
| `thead`    | -                                 | Custom header row content               |
| `actions`  | `{ entry: T }`                    | Actions column content for each row     |
| `[column]` | `{ entry: T; value: T[keyof T] }` | Custom cell content for specific column |

### Actions Slot

The `actions` slot provides a dedicated column for row-specific actions like edit, delete, view, etc. It receives the entire row data as a prop.

**Props:**

- `entry: T` - The complete row data object

**Features:**

- Automatically creates an actions column when the slot is used
- Receives full row context for action handling
- Perfect for buttons, dropdowns, or other interactive elements

### Custom Column Slots

Custom slots allow you to override the default rendering of any column. The slot name should match the column key from your data.

**Props:**

- `entry: T` - The complete row data object
- `value: T[keyof T]` - The specific cell value for the column

**Features:**

- Override default text rendering for any column
- Access to both cell value and full row data
- Support for complex components like badges, images, or custom widgets

## Features

### Data Handling

- **Dynamic Columns**: Automatically generates columns from data objects
- **Extra Columns**: Add additional columns with null values
- **Column Omission**: Hide specific columns from display
- **Type Safety**: Full TypeScript support with generics

### Sorting

- **URL State**: Sorting state is managed via URL query parameters
- **Visual Indicators**: Sort arrows show current sort direction
- **Multiple Sortable**: Support for multiple sortable columns
- **Dictionary Integration**: Uses dictionary for column labels

### Sticky Elements

- **Sticky Headers**: Keep headers visible during scroll
- **Sticky Cells**: Keep specific columns visible on mobile
- **Responsive**: Sticky behavior adapts to screen size

### Customization

- **Custom Slots**: Render custom content for any column
- **Actions Column**: Dedicated slot for row actions
- **CSS Classes**: Customizable styling for rows, headers, and cells
- **Responsive Design**: Horizontal scroll on smaller screens

## Usage Examples

### Basic Table

```vue
<script setup>
const data = ref([
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Inactive' }
]);
</script>

<template>
  <AppTable :columns="data" sort-by="name,email" />
</template>
```

### Table with Actions Column

```vue
<script setup>
const data = ref([
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Inactive' }
]);

const onEdit = (entry) => {
  console.log('Edit:', entry);
};

const onDelete = (entry) => {
  console.log('Delete:', entry);
};
</script>

<template>
  <AppTable :columns="data">
    <template #actions="{ entry }">
      <div class="flex items-center gap-2">
        <button @click="onEdit(entry)" class="btn btn-default hover:bg-blue-600">Edit</button>

        <button @click="onDelete(entry)" class="btn btn-default hover:bg-red-600">Delete</button>
      </div>
    </template>
  </AppTable>
</template>
```

### Table with Custom Cell Rendering

```vue
<script setup>
const data = ref([
  { id: 1, name: 'John Doe', status: 'active', avatar: '/avatar1.jpg' },
  { id: 2, name: 'Jane Smith', status: 'inactive', avatar: '/avatar2.jpg' }
]);
</script>

<template>
  <AppTable :columns="data">
    <template #avatar="{ value }">
      <img :src="value" class="size-8 rounded-full" />
    </template>

    <template #status="{ value }">
      <AppBadge :type="value === 'active' ? 'success' : 'danger'" :label="value" />
    </template>
  </AppTable>
</template>
```

### Sticky Header Table

```vue
<template>
  <AppTable :columns="data" sticky-head sticky-cells="name" sort-by="name,email,role" />
</template>
```

### Table with Hidden Columns

```vue
<template>
  <AppTable :columns="data" omit="internalId" sort-by="name,email" />
</template>
```

## Slot Best Practices

### Actions Slot

- Use for row-specific actions like edit, delete, view, etc.
- Keep actions compact and accessible
- Consider using icons for better space utilization
- Handle click events within the slot content

### Custom Column Slots

- Use for complex data rendering (images, badges, formatted dates)
- Access both `value` (cell data) and `entry` (full row) as needed
- Maintain consistent styling with the rest of the table
- Consider accessibility (alt text for images, proper ARIA labels)

### Performance Considerations

- Custom slots only render when provided
- Use `v-if` for conditional rendering within slots
- Avoid heavy computations within slot templates

## Styling

The component uses these CSS classes:

- **Rows**: `table-tr`
- **Headers**: `table-th`
- **Cells**: `table-td`

Additional classes can be applied via `trClass`, `thClass`, and `tdClass` props.

## Technical Details

### Data Processing

- **Column Merging**: Combines data with extra columns
- **Type Safety**: Full TypeScript generics support
- **Dynamic Rendering**: Automatically adapts to data structure

### Sorting Implementation

- **URL Integration**: Sort state persists in URL
- **Visual Feedback**: Sort arrows indicate direction
- **Dictionary Labels**: `useDictionary()` Utility for column label formatting

### Responsive Design

- **Horizontal Scroll**: Table scrolls horizontally on small screens

## Dependencies

- **Dictionary**: `useDictionary()` Utility for column label formatting
