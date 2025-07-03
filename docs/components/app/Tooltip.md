# AppTooltip Component

A flexible tooltip component that uses Floating UI for precise positioning. Supports hover, click, and pointer-based activation with automatic placement and smooth animations.

## Props

| Prop         | Type     | Default | Description                                    |
| ------------ | -------- | ------- | ---------------------------------------------- |
| `trigger`    | `string` | -       | Default text content for the trigger element   |
| `message`    | `string` | -       | Default tooltip message content                |
| `hoverClass` | `string` | -       | Additional CSS classes for the trigger element |

## Slots

| Slot      | Description                                                |
| --------- | ---------------------------------------------------------- |
| `default` | Content for the trigger element (overrides `trigger` prop) |
| `message` | Custom tooltip content (overrides `message` prop)          |

## Features

### Activation Methods

- **Hover**: Shows tooltip on mouse hover
- **Click**: Shows tooltip on click (stays open)
- **Pointer Move**: Follows cursor position for precise tooltips
- **Pointer Leave**: Hides tooltip when mouse leaves trigger area

### Positioning

- **Floating UI Integration**: Uses `@floating-ui/vue` for precise positioning
- **Auto Placement**: Automatically chooses the best placement to stay in viewport
- **Offset**: 20px offset from trigger element
- **Shift**: Adjusts position to prevent overflow
- **Padding**: 10px padding from viewport edges

### Animation

- **Smooth Transitions**: Uses Vue's Transition component
- **Opacity Animation**: Fades in/out with opacity transitions
- **Teleport**: Renders tooltip in separate container to avoid layout issues

### Styling

- **Customizable**: Accepts custom CSS classes via `class` attribute
- **Responsive**: Adapts to content and available space
- **Z-Index**: Proper layering with `z-10` class

## Usage Examples

### Basic Tooltip

```vue
<AppTooltip trigger="Hover me" message="This is a helpful tooltip" />
```

### Custom Trigger

```vue
<AppTooltip message="This is a helpful tooltip">
  <button class="btn">Hover me</button>
</AppTooltip>
```

### Custom Tooltip Content

```vue
<AppTooltip>
  <button class="btn">Complex Tooltip</button>

  <template #message>
    <div class="p-2">
      <h4 class="font-medium">Custom Content</h4>
      <p class="text-sm">This tooltip has custom HTML content.</p>
      <button class="btn btn-sm mt-2">Action</button>
    </div>
  </template>
</AppTooltip>
```

## Styling

The component uses these CSS classes:

- `tooltip-content`: Applied to the tooltip content container

Additional classes can be applied via the `class` attribute on the tooltip content.

## Technical Details

### Floating UI Configuration

- **offset(20)**: 20px distance from trigger element
- **autoPlacement()**: Automatically chooses best placement
- **shift()**: Prevents tooltip from overflowing viewport

### Event Handling

- **Pointer Events**: Uses modern pointer events for better touch support
- **Dynamic Positioning**: Updates position on pointer move
- **Auto Update**: Floating UI automatically updates position

## Dependencies

- **@floating-ui/vue**: For positioning and middleware
