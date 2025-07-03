# AppDrawer Component

A bottom sheet drawer component with smooth slide-up animations and backdrop blur. Provides a mobile-friendly overlay interface that slides up from the bottom of the screen.

## Events

| Event   | Description                                     |
| ------- | ----------------------------------------------- |
| `close` | Emitted when drawer is closed (after animation) |

## Slots

| Slot      | Description         |
| --------- | ------------------- |
| `default` | Main drawer content |

## Features

### Animation

- **Slide Up**: Translate animation from bottom to top
- **Focus Management**: Automatically focuses drawer on open

### Accessibility

- **Keyboard Support**: ESC key closes the drawer

### Behavior

- **Auto Open**: Drawer opens automatically on mount
- **Auto Close**: Closes automatically on unmount
- **Event Cleanup**: Proper timeout cleanup to prevent memory leaks
- **Teleport**: Renders outside DOM hierarchy

## Usage Examples

### Basic Drawer

```vue
<AppDrawer @close="handleClose">
  <div class="py-6">
    <h2 class="text-xl font-medium mb-4">Basic Drawer</h2>
    <p>This is a simple drawer with default styling.</p>
  </div>
</AppDrawer>
```

### Form Drawer

```vue
<AppDrawer @close="handleClose">
  <div class="py-6">
    <h2 class="text-xl font-medium mb-6">Add Item</h2>
    
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <FormControl label="Name" name="name" required />
      <FormControl label="Description" name="description" type="textarea" />
      
      <div class="flex gap-2 pt-4">
        <button type="submit" class="btn flex-1">Save</button>
        <button type="button" @click="handleClose" class="btn btn-outline flex-1">Cancel</button>
      </div>
    </form>
  </div>
</AppDrawer>
```

## Styling

The component uses these CSS classes:

- **drawer-content**: Main content container
- **drawer-overflow**: Gradient fade overlays at top and bottom

## Technical Details

### Event Handling

- **ESC Key**: Closes drawer on escape key press
- **Backdrop Click**: Closes drawer when clicking outside
- **Custom Events**: Emits close event after animation
