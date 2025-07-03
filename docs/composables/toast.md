# useToast Composable

A Vue 3 composable that provides a complete toast notification system with automatic rendering, animations, and lifecycle management. Uses Vue's render function to dynamically create and manage toast notifications without requiring a separate component.

## Return Values

| Property   | Type                                                          | Description                  |
| ---------- | ------------------------------------------------------------- | ---------------------------- |
| `setToast` | `(title: string, message?: string, type?: ToastType) => void` | Display a toast notification |

## Types

```typescript
type Toast = {
  id?: number;
  title: string;
  message?: string;
  type?: 'success' | 'error' | 'info';
  timeoutId?: NodeJS.Timeout;
};

type ToastType = 'success' | 'error' | 'info';
```

## Features

### Toast Management

- **Automatic Rendering**: Uses Vue's render function for dynamic toast creation
- **Global State**: Uses Nuxt's `useState` for persistent toast state
- **Auto-dismiss**: Automatic timeout with 3-second default duration
- **Manual Dismiss**: Click-to-close functionality

### Toast Types

- **Success**: Green styling with check icon
- **Error**: Red styling with cancel icon
- **Info**: Blue styling with info icon

### User Interaction

- **Hover to Pause**: Pause auto-dismiss on hover
- **Resume on Leave**: Resume timer when mouse leaves
- **Manual Close**: Click X button to dismiss immediately

### Animation System

- **Smooth Entrances**: Slide up with opacity fade
- **Smooth Exits**: Slide right with opacity fade
- **Transition Group**: Proper list animations for multiple toasts

## Usage Examples

### Basic Toast Notifications

```vue
<script setup>
const { setToast } = useToast();

const showSuccessToast = () => setToast('Success!', 'Your action was completed successfully.', 'success');

const showErrorToast = () => setToast('Error!', 'Something went wrong. Please try again.', 'error');

const showInfoToast = () => setToast('Info', 'Here is some helpful information.', 'info');

const showSimpleToast = () => setToast('Simple notification');
</script>

<template>
  <div class="space-y-4">
    <button @click="showSuccessToast" class="btn btn-success">Show Success Toast</button>

    <button @click="showErrorToast" class="btn btn-error">Show Error Toast</button>

    <button @click="showInfoToast" class="btn btn-info">Show Info Toast</button>

    <button @click="showSimpleToast" class="btn">Show Simple Toast</button>
  </div>
</template>
```

### Form Submission Feedback

```vue
<script setup>
const { setToast } = useToast();

const formData = reactive({
  name: '',
  email: ''
});

const onSubmit = async () => {
  await $fetch('/api/submit', { method: 'POST', body: formData })
    .then(() => {
      setToast('Success!', 'Your form has been submitted successfully.', 'success');
    })
    .catch(() => {
      setToast('Error!', 'Failed to submit form. Please try again.', 'error');
    });
};
</script>

<template>
  <form @submit.prevent="onSubmit">
    <FormControl v-model="formData.name" name="name" label="Name" />
    <FormControl v-model="formData.email" name="email" type="email" label="Email" />
    <button type="submit" class="btn">Submit</button>
  </form>
</template>
```

## Technical Details

### Toast Rendering

- **Dynamic Creation**: Uses Vue's `h()` function to create toast elements
- **Teleport Target**: Renders to `#teleports` container for proper positioning
- **Transition Group**: Manages multiple toasts with smooth animations

### Toast Lifetime Management

- **Default Duration**: 3 seconds auto-dismiss
- **Hover Pause**: Timer pauses when mouse enters toast area
- **Resume on Leave**: Timer resumes when mouse leaves toast area
- **Manual Dismiss**: Click X button to remove immediately
- **Multiple Toasts**: Each toast has independent timer management

## Dependencies

- **AppIcon**: For toast type icons
