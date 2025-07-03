# AppBadge Component

A flexible badge component with multiple types, sizes, and icon support. Provides visual indicators for status, categories, and notifications with consistent styling.

## Props

| Prop    | Type                                                        | Default     | Description                           |
| ------- | ----------------------------------------------------------- | ----------- | ------------------------------------- |
| `type`  | `'default' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'default'` | Visual style variant of the badge     |
| `label` | `string \| number`                                          | `'Badge'`   | Text content displayed in the badge   |
| `icon`  | `string`                                                    | -           | Icon name to display before the label |
| `size`  | `'default' \| 'sm' \| 'lg'`                                 | `'default'` | Size variant of the badge             |

## Slots

| Slot      | Description                                         |
| --------- | --------------------------------------------------- |
| `default` | Custom content (overrides `label` and `icon` props) |
| `icon`    | Custom icon content (overrides `icon` prop)         |
| `label`   | Custom label content (overrides `label` prop)       |

## Features

### Type Variants

- **Default**: Neutral gray styling for general use
- **Success**: Green styling for positive states
- **Warning**: Yellow styling for caution states
- **Danger**: Red styling for error states
- **Info**: Blue styling for informational states

### Size Variants

- **Small**: Compact size for tight spaces
- **Default**: Standard size for most use cases
- **Large**: Larger size for emphasis

### Icon Support

- **Built-in Icons**: Uses AppIcon component for consistent iconography
- **Custom Icons**: Supports custom icon content via slots
- **Automatic Sizing**: Icons scale appropriately with badge size

### Styling

- **Ring Borders**: Subtle ring borders for definition
- **Color Coding**: Semantic colors for different types
- **Responsive**: Adapts to content and container
- **Accessible**: Proper contrast ratios and sizing

## Usage Examples

### Basic Badge

```vue
<AppBadge label="New" />
```

### Badge with Type

```vue
<AppBadge type="success" label="Active" />
<AppBadge type="warning" label="Pending" />
<AppBadge type="danger" label="Error" />
<AppBadge type="info" label="Info" />
```

### Badge with Icon

```vue
<AppBadge icon="check" label="Verified" type="success" />
<AppBadge icon="alert" label="Warning" type="warning" />
<AppBadge icon="info" label="Note" type="info" />
```

### Different Sizes

```vue
<AppBadge size="sm" label="Small" />
<AppBadge size="default" label="Default" />
<AppBadge size="lg" label="Large" />
```

### Custom Content

```vue
<AppBadge type="success">
  <template #icon>
    <AppIcon name="star" class="text-yellow-500" />
  </template>
  <template #label>
    <span class="font-bold">Premium</span>
  </template>
</AppBadge>
```

## Styling

The component uses these CSS classes:

- **Base**: `inline-flex items-center justify-center gap-1.5 font-medium ring ring-inset`
- **Types**: Semantic color classes for each variant
- **Sizes**: Responsive padding and text sizing

### Type Styles

- **default**: `bg-darwin ring-edison shadow-xs dark:shadow-black/20`
- **success**: `bg-green-500/10 ring-green-500/20 text-green-600`
- **warning**: `bg-yellow-500/10 ring-yellow-500/20 text-yellow-600`
- **danger**: `bg-red-500/10 ring-red-500/20 text-red-500`
- **info**: `bg-blue-500/10 ring-blue-500/20 text-blue-500`

### Size Styles

- **sm**: `px-1.5 py-0.5 text-xs rounded-md`
- **default**: `px-2 py-1 text-xs rounded-md`
- **lg**: `px-2.5 py-1.5 text-sm rounded-lg`

## Technical Details

### Component Structure

- **Icon Integration**: Seamless integration with AppIcon component
- **Slot System**: Flexible content system with fallbacks

### Accessibility

- **Semantic Colors**: Color-coded for different meanings
- **Proper Contrast**: Ensures readability across themes
- **Icon Support**: Icons enhance visual communication

## Dependencies

- **AppIcon**: For icon display
