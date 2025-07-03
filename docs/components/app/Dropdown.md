# AppDropdown Component

A flexible dropdown component that uses Floating UI for precise positioning and smooth animations. Supports custom triggers, automatic positioning, and click-outside behavior.

## Props

| Prop                 | Type      | Default          | Description                                                           |
| -------------------- | --------- | ---------------- | --------------------------------------------------------------------- |
| `placement`          | `string`  | `'bottom-start'` | Placement of the dropdown relative to the trigger element             |
| `autoclose`          | `boolean` | `false`          | Whether the dropdown should close when mouse leaves the dropdown area |
| `dropdownClass`      | `string`  | -                | Additional CSS classes to apply to the dropdown content container     |
| `dropdownInnerClass` | `string`  | -                | Additional CSS classes to apply to the inner dropdown content         |

## Slots

| Slot      | Props                 | Description                                        |
| --------- | --------------------- | -------------------------------------------------- |
| `trigger` | `{ isOpen: boolean }` | The trigger element that opens/closes the dropdown |
| `default` | -                     | The dropdown content (menu items, etc.)            |

## Features

### Positioning

- **Floating UI Integration**: Uses `@floating-ui/vue` for precise positioning
- **Automatic Placement**: Automatically adjusts position to stay within viewport
- **Multiple Placements**: Supports all Floating UI placement options
- **Responsive**: Adapts to available space with size middleware

### Behavior

- **Click Outside**: Automatically closes when clicking outside the dropdown
- **Toggle**: Clicking the trigger toggles the dropdown state
- **Auto Close**: Optional auto-close on mouse leave
- **Teleport**: Renders dropdown content in a teleport container

### Animation

- **Enter Animation**: Fades in and slides up from bottom
- **Exit Animation**: Fades out and slides down

### Styling

- **Customizable**: Accepts custom CSS classes for both container and inner content
- **Responsive Design**: Automatically adjusts max-width and max-height based on available space

## Usage Examples

### Basic Dropdown

```vue
<AppDropdown>
  <template #trigger="{ isOpen }">
    <button class="btn">
      Menu
      <AppIcon :name="isOpen ? 'chevron-up' : 'chevron-down'" />
    </button>
  </template>
  
  <div class="flex flex-col">
    <a href="#" class="btn">Profile</a>
    <a href="#" class="btn">Settings</a>
    <a href="#" class="btn">Logout</a>
  </div>
</AppDropdown>
```

### Dropdown with Custom Placement and Auto-close

```vue
<AppDropdown placement="top-end" autoclose>
  <template #trigger="{ isOpen }">
    <button class="btn">
      Options
      <AppIcon :name="isOpen ? 'chevron-up' : 'chevron-down'" />
    </button>
  </template>
  
  <div class="dropdown-menu">
    <button class="dropdown-item">Edit</button>
    <button class="dropdown-item">Delete</button>
    <button class="dropdown-item">Duplicate</button>
  </div>
</AppDropdown>
```

## Placement Options

The `placement` prop accepts all Floating UI placement values:

- `top`, `top-start`, `top-end`
- `bottom`, `bottom-start`, `bottom-end`
- `left`, `left-start`, `left-end`
- `right`, `right-start`, `right-end`

## Styling

The component uses these CSS classes:

- `dropdown-content`: Applied to the main dropdown container
- `dropdown-inner`: Applied to the inner content wrapper

Additional classes can be applied via `dropdownClass` and `dropdownInnerClass` props.

## Dependencies

- `@floating-ui/vue`: For positioning and middleware
- `useFloating`: Main floating UI composable
- `offset`, `shift`, `flip`, `size`: Floating UI middleware
- `autoUpdate`: For automatic position updates
- `Teleport`: Vue's teleport component for rendering outside DOM hierarchy
- `Transition`: Vue's transition component for animations

## Technical Details

### Middleware Configuration

- **offset(8)**: Adds 8px spacing between trigger and dropdown
- **shift()**: Shifts the dropdown to keep it in viewport
- **flip()**: Flips the placement when there's not enough space
- **size()**: Adjusts max-width and max-height based on available space

### Event Handling

- **Click Outside**: Uses document event listener to detect clicks outside
- **Mouse Leave**: Optional auto-close when mouse leaves dropdown area
- **Toggle**: Click on trigger toggles the dropdown state
