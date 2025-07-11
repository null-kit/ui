# FormSelect Component

A flexible and feature-rich select component with support for single/multiple selection, search functionality, option groups, custom rendering, and form validation. Built on top of AppDropdown for consistent positioning and behavior.

## Props

| Prop          | Type        | Default | Description                                 |
| ------------- | ----------- | ------- | ------------------------------------------- |
| `options`     | `T[]`       | -       | Array of options to display                 |
| `label`       | `string`    | -       | Label text displayed above the select       |
| `name`        | `string`    | -       | Name attribute for form validation          |
| `placeholder` | `string`    | -       | Placeholder text when no option is selected |
| `keyName`     | `keyof T`   | -       | Property name to use as display text        |
| `keyValue`    | `keyof T`   | -       | Property name to use as value               |
| `multiple`    | `boolean`   | `false` | Whether to allow multiple selections        |
| `search`      | `boolean`   | `false` | Whether to show search input                |
| `order`       | `boolean`   | `false` | Whether to order selected items first       |
| `placement`   | `Placement` | -       | Dropdown placement (from Floating UI)       |
| `inputClass`  | `string`    | -       | Additional CSS classes for the input        |
| `autoclose`   | `boolean`   | `false` | Whether to auto-close on selection          |
| `required`    | `boolean`   | `false` | Whether the field is required               |
| `help`        | `string`    | -       | Help text displayed below the select        |

## Model

The component uses Vue 3's `defineModel()` for two-way data binding:

```typescript
const model = defineModel<T | T[] | keyof T | T[keyof T] | null>();
```

- **Single Selection**: `T` or `keyof T` (when using `keyValue`)
- **Multiple Selection**: `T[]` or `keyof T[]` (when using `keyValue`)

## Slots

| Slot          | Props          | Description                                 |
| ------------- | -------------- | ------------------------------------------- |
| `label-left`  | -              | Content before the label text               |
| `label-right` | -              | Content after the label text                |
| `left`        | -              | Content before the select input             |
| `right`       | -              | Content after the select input              |
| `option`      | `{ value: T }` | Custom option content rendering             |
| `help`        | -              | Custom help content (overrides `help` prop) |

## Features

### Selection Modes

- **Single Selection**: Choose one option at a time
- **Multiple Selection**: Choose multiple options with removable tags
- **Value Mapping**: Use different properties for display and value

### Search and Filtering

- **Search Input**: Filter options by typing
- **Real-time Filtering**: Options update as you type
- **Case Insensitive**: Search works regardless of case
- **Group Support**: Search works within option groups

### Option Groups

- **Grouped Options**: Organize options into logical groups
- **Group Labels**: Display group names for better organization
- **Nested Structure**: Support for complex option hierarchies
- **Group Format**: `{ group: string, list: T[] }`

### Visual Features

- **Checkmarks**: Visual indicators for selected options with animated transitions
- **Ordering**: Selected items can appear first in the list when `order` is true
- **Removable Tags**: Multiple selection shows removable option tags with close icons
- **Empty State**: Shows "No Results" icon and message when no options match
- **Dropdown Arrow**: Animated chevron icon indicating dropdown state
- **Focus States**: Visual feedback with accent color ring

### Integration

- **Form Validation**: Integrates with FormValidate component when `name` is provided
- **Dropdown Positioning**: Uses AppDropdown for consistent behavior and positioning

## Usage Examples

### Basic Select

```vue
<script setup>
const options = ref([
  { id: 1, name: 'Option 1' },
  { id: 2, name: 'Option 2' },
  { id: 3, name: 'Option 3' }
]);

const selected = ref();
</script>

<template>
  <FormSelect
    v-model="selected"
    :options="options"
    key-name="name"
    key-value="id"
    label="Choose an option"
    placeholder="Select an option"
  />
</template>
```

### Multiple Selection

```vue
<script setup>
const options = ref([
  { id: 1, name: 'Apple' },
  { id: 2, name: 'Banana' },
  { id: 3, name: 'Orange' },
  { id: 4, name: 'Grape' }
]);

const selected = ref([]);
</script>

<template>
  <FormSelect
    v-model="selected"
    :options="options"
    key-name="name"
    key-value="id"
    multiple
    label="Select fruits"
    placeholder="Choose fruits"
  />
</template>
```

### Searchable Select with Ordering

```vue
<script setup>
const options = ref([
  { id: 1, name: 'JavaScript' },
  { id: 2, name: 'TypeScript' },
  { id: 3, name: 'Python' },
  { id: 4, name: 'Java' },
  { id: 5, name: 'C++' }
]);

const selected = ref([]);
</script>

<template>
  <FormSelect
    v-model="selected"
    :options="options"
    key-name="name"
    key-value="id"
    multiple
    search
    order
    label="Programming Languages"
    placeholder="Search and select languages"
  />
</template>
```

### Option Groups

```vue
<script setup>
const options = ref([
  {
    group: 'Frontend',
    list: [
      { id: 1, name: 'React' },
      { id: 2, name: 'Vue' },
      { id: 3, name: 'Angular' }
    ]
  },
  {
    group: 'Backend',
    list: [
      { id: 4, name: 'Node.js' },
      { id: 5, name: 'Django' },
      { id: 6, name: 'Spring' }
    ]
  }
]);

const selected = ref();
</script>

<template>
  <FormSelect
    v-model="selected"
    :options="options"
    key-name="name"
    key-value="id"
    search
    label="Framework"
    placeholder="Choose framework"
  />
</template>
```

### Custom Option Rendering

```vue
<script setup>
const options = ref([
  { id: 1, name: 'John Doe', avatar: '/avatar1.jpg', role: 'Admin' },
  { id: 2, name: 'Jane Smith', avatar: '/avatar2.jpg', role: 'User' }
]);

const selected = ref();
</script>

<template>
  <FormSelect
    v-model="selected"
    :options="options"
    key-name="name"
    key-value="id"
    label="Select User"
    placeholder="Choose user"
  >
    <template #option="{ value }">
      <div class="flex items-center gap-2">
        <img :src="value.avatar" class="h-6 w-6 rounded-full" />
        <span>{{ value.name }}</span>
        <AppBadge :label="value.role" size="sm" />
      </div>
    </template>
  </FormSelect>
</template>
```

### With Left/Right Slots

```vue
<script setup>
const options = ref([
  { id: 1, name: 'Option 1' },
  { id: 2, name: 'Option 2' }
]);

const selected = ref();
</script>

<template>
  <FormSelect
    v-model="selected"
    :options="options"
    key-name="name"
    key-value="id"
    label="With Icons"
    placeholder="Select option"
  >
    <template #left>
      <div class="text-surface/50 flex items-center px-2">
        <svg class="size-4" viewBox="0 0 32 32">
          <path d="M16 4l12 12-12 12" stroke="currentColor" fill="none" stroke-width="2" />
        </svg>
      </div>
    </template>

    <template #right>
      <div class="text-surface/50 flex items-center px-2">
        <svg class="size-4" viewBox="0 0 32 32">
          <path d="M16 4l12 12-12 12" stroke="currentColor" fill="none" stroke-width="2" />
        </svg>
      </div>
    </template>
  </FormSelect>
</template>
```

### Required Field with Validation

```vue
<script setup>
const options = ref([
  { id: 1, name: 'Option 1' },
  { id: 2, name: 'Option 2' }
]);

const selected = ref();
</script>

<template>
  <FormSelect
    v-model="selected"
    :options="options"
    key-name="name"
    key-value="id"
    name="mySelect"
    label="Required Field"
    required
    help="This field is required"
  />
</template>
```

## Styling

The component uses these CSS classes:

- **Input**: `select-input` with conditional `ring-accent` for focus state
- **Multiple Tags**: `select-multiple` with `btn btn-sm btn-default` for tags
- **Slot**: `select-slot` with conditional `rounded-l-none` and `rounded-r-none` for left and right slots
- **Group Labels**: `select-group-label`

Additional classes can be applied via the `inputClass` prop.

## Technical Details

### Data Processing

- **Value Mapping**: Supports different properties for display and value
- **Type Safety**: Full TypeScript generics support with `T extends Record<string, unknown> | string | number`
- **Array Handling**: Efficient handling of single and multiple selections
- **Null Safety**: Proper handling of null/undefined values

### Search Implementation

- **Real-time Filtering**: Updates options as user types using `computed`
- **Case Insensitive**: Search works regardless of case using `toLowerCase()`
- **Group Support**: Search works within option groups
- **Performance**: Efficient filtering with minimal re-renders

### Selection Logic

- **Toggle Behavior**: Click to select/deselect options
- **Multiple Mode**: Maintains array of selected items
- **Single Mode**: Single value with toggle to deselect
- **Value Extraction**: Uses `keyValue` property when specified

## Dependencies

- **AppDropdown**: For dropdown positioning and behavior
- **FormValidate**: For form validation integration
- **Floating UI**: For precise dropdown positioning
