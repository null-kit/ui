# AppTable Component

A flexible table component with sorting, sticky headers, custom cell rendering, and responsive design. Supports dynamic columns, custom slots for cell content, and URL-based sorting state.

## Props

| Prop           | Type       | Default   | Description                              |
| -------------- | ---------- | --------- | ---------------------------------------- |
| `columns`      | `T[]`      | -         | Array of data objects for table rows     |
| `columnsExtra` | `string`   | -         | Comma-separated extra column keys to add |
| `stickyHead`   | `boolean`  | `false`   | Whether to make the header sticky        |
| `stickyOffset` | `string`   | `'top-0'` | CSS class for sticky header positioning  |
| `stickyCells`  | `string[]` | -         | Column keys to make sticky               |
| `sortBy`       | `string[]` | -         | Column keys that are sortable            |
| `trClass`      | `string`   | -         | Additional CSS classes for table rows    |
| `thClass`      | `string`   | -         | Additional CSS classes for table headers |
| `tdClass`      | `string`   | -         | Additional CSS classes for table cells   |
| `omit`         | `string[]` | -         | Column keys to hide from display         |

## Slots

| Slot          | Props                             | Description                               |
| ------------- | --------------------------------- | ----------------------------------------- |
| `thead`       | -                                 | Custom header row content                 |
| `actions`     | `{ entry: T }`                    | Actions column content for each row       |
| `[column]`    | `{ entry: T; value: T[keyof T] }` | Custom cell content for specific column   |
| `th-[column]` | -                                 | Custom header content for specific column |

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

### Custom Header Slots

Custom header slots allow you to add additional content to specific column headers. The slot name should follow the pattern `th-[columnKey]`.

**Features:**

- Add custom content to specific column headers
- Renders between the column label and sort arrows
- Perfect for filters, icons, or additional header controls
- Maintains sorting functionality

## Features

### Data Handling

- **Dynamic Columns**: Automatically generates columns from data objects
- **Extra Columns**: Add additional columns with null values using `columnsExtra`
- **Column Omission**: Hide specific columns from display using `omit` prop
- **Type Safety**: Full TypeScript support with generics

### Sorting

- **URL State**: Sorting state is managed via URL query parameters
- **Visual Indicators**: Sort arrows show current sort direction
- **Multiple Sortable**: Support for multiple sortable columns
- **Dictionary Integration**: Uses `useDictionary()` for column labels
- **Toggle Direction**: Click toggles between ascending and descending

### Sticky Elements

- **Sticky Headers**: Keep headers visible during scroll with `stickyHead`
- **Sticky Cells**: Keep specific columns visible on mobile with `stickyCells`
- **Responsive**: Sticky behavior adapts to screen size (sticky cells only on md+ screens)

### Customization

- **Custom Slots**: Render custom content for any column
- **Custom Headers**: Add custom content to specific column headers
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

### Table with Custom Header Content

```vue
<script setup>
const data = ref([
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Inactive' }
]);
</script>

<template>
  <AppTable :columns="data" sort-by="name,email,status">
    <template #th-name>
      <AppIcon name="user" class="text-surface/50 size-4" />
    </template>

    <template #th-email>
      <AppIcon name="mail" class="text-surface/50 size-4" />
    </template>

    <template #th-status>
      <button class="btn btn-sm btn-default">Filter</button>
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

### Table with Extra Columns

```vue
<template>
  <AppTable :columns="data" columns-extra="actions,notes" sort-by="name,email" />
</template>
```

### Custom Header Row

```vue
<template>
  <AppTable :columns="data" sort-by="name,email">
    <template #thead>
      <tr class="table-tr">
        <th class="table-th">Custom Header</th>
        <th class="table-th">Another Header</th>
      </tr>
    </template>
  </AppTable>
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

### Custom Header Slots

- Use for adding icons, filters, or additional controls to headers

### Performance Considerations

- Custom slots only render when provided
- Use `v-if` for conditional rendering within slots
- Avoid heavy computations within slot templates

## Styling

The component uses these CSS classes:

- **Container**: `scrollbar w-full overflow-auto`
- **Table**: `w-full border-separate border-spacing-0 text-sm whitespace-nowrap`
- **Header**: `table-thead select-none`
- **Rows**: `table-tr last:*:border-b-0`
- **Headers**: `table-th`
- **Cells**: `table-td`

Additional classes can be applied via `trClass`, `thClass`, and `tdClass` props.

## Technical Details

### Data Processing

- **Column Merging**: Combines data with extra columns using `columnsExtra`
- **Type Safety**: Full TypeScript generics support with `T extends Record<string, unknown>`
- **Dynamic Rendering**: Automatically adapts to data structure

### Sorting Implementation

- **URL Integration**: Sort state persists in URL query parameters
- **Visual Feedback**: Sort arrows indicate direction with accent color
- **Dictionary Labels**: Uses `useDictionary()` utility for column label formatting
- **Toggle Logic**: Alternates between ascending and descending on click

### Responsive Design

- **Horizontal Scroll**: Table scrolls horizontally on small screens

## Dependencies

- **Dictionary**: `useDictionary()` Utility for column label formatting
