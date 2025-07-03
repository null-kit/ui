# AppModal Component

A flexible modal component with smooth animations, backdrop blur, and keyboard support. Provides a clean API for creating overlay dialogs with customizable content and styling.

## Props

| Prop         | Type     | Default      | Description                                  |
| ------------ | -------- | ------------ | -------------------------------------------- |
| `modalClass` | `string` | `'max-w-xl'` | Additional CSS classes for the modal content |

## Slots

| Slot      | Description                                      |
| --------- | ------------------------------------------------ |
| `default` | Main modal content                               |
| `header`  | Custom header content (overrides default header) |
| `title`   | Modal title content                              |

## Events

| Event   | Description                                    |
| ------- | ---------------------------------------------- |
| `close` | Emitted when modal is closed (after animation) |

## Features

### Animation

- **Backdrop Fade**: Smooth opacity transition for backdrop
- **Content Scale**: Scale and translate animation for modal content
- **Focus Management**: Automatically focuses modal on open

### Accessibility

- **Keyboard Support**: ESC key closes the modal

### Styling

- **Customizable**: Accepts custom CSS classes
- **Centered**: Modal content is automatically centered

### Behavior

- **Auto Open**: Modal opens automatically on mount
- **Auto Close**: Closes automatically on unmount
- **Event Cleanup**: Proper timeout cleanup to prevent memory leaks
- **Teleport**: Renders outside DOM hierarchy

## Usage Examples

### Basic Modal

```vue
<AppModal title="Basic Modal" @close="handleClose">
  <div class="p-6">
    <p>This is a simple modal with default styling.</p>
  </div>
</AppModal>
```

### Modal with Custom Title and Size

```vue
<AppModal modal-class="max-w-4xl" @close="handleClose">
  <template #title>
    <h2 class="text-xl font-medium">Custom Title</h2>
  </template>
  
  <div class="p-6">
    <p>Modal content with custom title slot.</p>
  </div>
</AppModal>
```

### Modal with Custom Header

```vue
<AppModal @close="handleClose">
  <template #header>
    <div class="flex items-center justify-between p-4 border-b">
      <h2 class="text-xl font-medium">Custom Header</h2>
      <button @click="handleClose" class="btn btn-sm">Close</button>
    </div>
  </template>
  
  <div class="p-6">
    <p>Modal with completely custom header.</p>
  </div>
</AppModal>
```

## Styling

The component uses these CSS classe:

- **Content**: `modal-content`

Additional classes can be applied via the `modalClass` prop.

## Technical Details

### Animation Configuration

- **Backdrop**: Opacity transition with 300ms duration
- **Content**: Scale and translate with appear animation
- **Focus**: Automatic focus after enter animation
- **Cleanup**: Proper cleanup after leave animation

### Event Handling

- **ESC Key**: Closes modal on escape key press
- **Close Button**: Built-in close button in header
- **Custom Events**: Emits close event after animation
