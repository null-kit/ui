# FormSelect Component

A flexible select component with support for single/multiple selection, search functionality, option groups, and custom rendering. Built on top of AppDropdown for consistent positioning and behavior.

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
const model = defineModel<T | T[] | keyof T | T[keyof T]>();
```

- **Single Selection**: `T` or `keyof T` (when using `keyValue`)
- **Multiple Selection**: `T[]` or `keyof T[]` (when using `keyValue`)

## Slots

| Slot     | Props          | Description                                 |
| -------- | -------------- | ------------------------------------------- |
| `option` | `{ value: T }` | Custom option content rendering             |
| `help`   | -              | Custom help content (overrides `help` prop) |

## Features

### Selection Modes

- **Single Selection**: Choose one option at a time
- **Multiple Selection**: Choose multiple options with removable tags
- **Value Mapping**: Use different properties for display and value

### Search and Filtering

- **Search Input**: Filter options by typing
- **Real-time Filtering**: Options update as you type
- **Case Insensitive**: Search works regardless of case

### Option Groups

- **Grouped Options**: Organize options into logical groups
- **Group Labels**: Display group names for better organization
- **Nested Structure**: Support for complex option hierarchies

### Visual Features

- **Checkmarks**: Visual indicators for selected options
- **Ordering**: Selected items can appear first in the list
- **Removable Tags**: Multiple selection shows removable option tags
- **Empty State**: Shows "No Results" when no options match

### Integration

- **Form Validation**: Integrates with FormValidate component
- **Dropdown Positioning**: Uses AppDropdown for consistent behavior
- **Accessibility**: Proper ARIA attributes and keyboard support

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

### Searchable Select

```vue
<script setup>
const options = ref([
  { id: 1, name: 'JavaScript' },
  { id: 2, name: 'TypeScript' },
  { id: 3, name: 'Python' },
  { id: 4, name: 'Java' },
  { id: 5, name: 'C++' }
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
    label="Programming Language"
    placeholder="Search languages"
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
- **Group Labels**: `select-group-label`

Additional classes can be applied via the `inputClass` prop.

## Technical Details

### Data Processing

- **Value Mapping**: Supports different properties for display and value
- **Type Safety**: Full TypeScript generics support
- **Array Handling**: Efficient handling of single and multiple selections

### Search Implementation

- **Real-time Filtering**: Updates options as user types
- **Case Insensitive**: Search works regardless of case
- **Group Support**: Search works within option groups

## Dependencies

- **AppDropdown**: For dropdown positioning and behavior
- **FormValidate**: For form validation integration
