# useConfirm Composable

A Vue 3 composable that creates programmatic confirmation dialogs using the AppModal component. Provides a clean API for displaying confirmation prompts with custom titles, messages, and actions.

## Parameters

| Parameter     | Type                  | Required | Default            | Description                                |
| ------------- | --------------------- | -------- | ------------------ | ------------------------------------------ |
| `title`       | `string`              | No       | `'Please confirm'` | Title displayed in the confirmation dialog |
| `message`     | `string`              | Yes      | -                  | Main message content of the confirmation   |
| `confirmText` | `string`              | No       | `'Accept'`         | Text displayed on the confirm button       |
| `onConfirm`   | `() => Promise<void>` | Yes      | -                  | Async function executed when user confirms |

## Features

### Modal Integration

- **AppModal Component**: Uses the AppModal component for consistent styling
- **Programmatic Rendering**: Creates modal dynamically without template
- **Auto Cleanup**: Automatically removes modal from DOM after action

### User Experience

- **Alert Icon**: Displays warning icon for visual emphasis
- **Responsive Design**: Modal adapts to content with max-width constraint
- **Button Styling**: Danger button for confirm, default button for cancel
- **Async Support**: Handles asynchronous confirmation actions

### Styling

- **Consistent Theming**: Uses existing button and modal styles
- **Fixed Width Buttons**: Both buttons have consistent 96px width
- **Proper Spacing**: Well-structured layout with appropriate gaps
- **Icon Integration**: Includes alert icon with proper opacity

## Usage Examples

### Basic Confirmation

```vue
<script setup>
const { useConfirm } = useNuxtApp();

const handleDelete = () => {
  useConfirm({
    message: 'Are you sure you want to delete this item?',
    onConfirm: async () => {
      // Perform delete operation
      await deleteItem();
      console.log('Item deleted successfully');
    }
  });
};
</script>

<template>
  <button @click="handleDelete" class="btn btn-danger">Delete Item</button>
</template>
```

### Custom Title and Button Text

```vue
<script setup>
const { useConfirm } = useNuxtApp();

const handleLogout = () => {
  useConfirm({
    title: 'Logout Confirmation',
    message: 'You have unsaved changes. Are you sure you want to logout?',
    confirmText: 'Logout',
    onConfirm: async () => {
      await logout();
      navigateTo('/login');
    }
  });
};
</script>

<template>
  <button @click="handleLogout" class="btn">Logout</button>
</template>
```
