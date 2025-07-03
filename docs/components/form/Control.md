# Control Component

A versatile form control component that renders different input types based on the `type` prop. Supports text inputs, textareas, select dropdowns, and includes validation integration.

## Props

| Prop          | Type                                                                    | Default  | Description                                                 |
| ------------- | ----------------------------------------------------------------------- | -------- | ----------------------------------------------------------- |
| `label`       | `string`                                                                | -        | Label text displayed above the input field                  |
| `type`        | `'text' \| 'password' \| 'email' \| 'number' \| 'textarea' \| 'select'` | `'text'` | The type of input to render                                 |
| `name`        | `string`                                                                | -        | Name attribute for the input field. Required for validation |
| `placeholder` | `string`                                                                | -        | Placeholder text for the input field                        |
| `inputClass`  | `string`                                                                | -        | Additional CSS classes to apply to the input element        |
| `help`        | `string`                                                                | -        | Help text displayed below the input field                   |
| `disabled`    | `boolean`                                                               | `false`  | Whether the input is disabled                               |
| `required`    | `boolean`                                                               | `false`  | Whether the field is required (shows asterisk)              |
| `accept`      | `string`                                                                | -        | File types accepted (for file inputs)                       |
| `pattern`     | `string`                                                                | -        | HTML pattern attribute for input validation                 |
| `step`        | `string`                                                                | -        | Step value for number inputs                                |

## Model

The component uses Vue 3's `defineModel()` for two-way data binding:

```typescript
const model = defineModel<string | number | null>();
```

- **Type**: `string | number | null`
- **Usage**: Use `v-model` to bind the input value
- **Special handling**: For `type="number"`, the component filters non-numeric characters and handles decimal points

## Slots

| Slot      | Description                                         |
| --------- | --------------------------------------------------- |
| `default` | For select inputs, contains the `<option>` elements |
| `left`    | Content displayed to the left of the input field    |
| `right`   | Content displayed to the right of the input field   |
| `help`    | Custom help content (overrides the `help` prop)     |

## Features

### Input Types

- **Text**: Standard text input
- **Password**: Password input with hidden characters
- **Email**: Email input with email validation
- **Number**: Numeric input with automatic filtering of non-numeric characters
- **Textarea**: Multi-line text input (3 rows by default)
- **Select**: Dropdown select with custom chevron icon

### Layout Features

- **Left/Right slots**: Add content (icons, buttons, etc.) to either side of the input
- **Responsive design**: Uses flexbox for proper alignment
- **Automatic styling**: Applies appropriate border radius when slots are used

### Validation Integration

- **FormValidate component**: Automatically included when `name` prop is provided
- **Required indicator**: Shows asterisk (\*) for required fields
- **Help text**: Displays below the input field

## Usage Examples

### Basic Text Input

```vue
<FormControl v-model="username" label="Username" name="username" placeholder="Enter your username" required />
```

### Number Input

```vue
<FormControl v-model="age" type="number" label="Age" name="age" placeholder="Enter your age" step="1" />
```

### Textarea

```vue
<FormControl
  v-model="description"
  type="textarea"
  label="Description"
  name="description"
  placeholder="Enter description..."
  help="Maximum 500 characters"
/>
```

### Select Dropdown

```vue
<FormControl v-model="country" type="select" label="Country" name="country" placeholder="Select a country">
  <option value="us">United States</option>
  <option value="ca">Canada</option>
  <option value="uk">United Kingdom</option>
</FormControl>
```

### Input with Left Slot (Icon)

```vue
<FormControl v-model="email" type="email" label="Email" name="email" placeholder="Enter your email">
  <template #left>
    <AppIcon name="mail" />
  </template>
</FormControl>
```

### Input with Right Slot (Button) and Custom Help Content

```vue
<FormControl v-model="password" type="password" label="Password" name="password" placeholder="Enter your password">
  <template #right>
    <button type="button" @click="togglePassword">
      <AppIcon :name="showPassword ? 'eye-off' : 'eye'" />
    </button>
  </template>

  <template #help>
    <div class="text-sm text-gray-600">
      <p>Accepted formats: PDF, DOC, DOCX</p>
      <p>Maximum file size: 10MB</p>
    </div>
  </template>
</FormControl>
```

## Styling

The component uses CSS classes for styling:

- `form-label`: Applied to the label element
- `form-required`: Applied to the required asterisk
- `form-input`: Applied to input elements
- `form-slot`: Applied to left/right slot containers
- `form-help`: Applied to help text container

Additional classes can be applied via the `inputClass` prop.

## Dependencies

- `useId()`: Generates unique IDs for form elements
- `useSlots()`: Detects available slots
- `FormValidate`: Validation component (included when `name` is provided)
