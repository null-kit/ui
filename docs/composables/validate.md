# useValidate Composable

A Vue 3 composable that provides form validation state management with error handling, clearing, and reactive updates. Uses Nuxt's `useState` for persistent validation state across components.

## Return Values

| Property      | Type                                                      | Description                      |
| ------------- | --------------------------------------------------------- | -------------------------------- |
| `validate`    | `Ref<ValidationErrors>`                                   | Reactive validation errors state |
| `setErrors`   | `(errors: ValidationErrors \| ValidationError[]) => void` | Set validation errors            |
| `clearErrors` | `() => void`                                              | Clear all validation errors      |
| `clearError`  | `(path: string) => void`                                  | Clear specific field error       |

## Types

```typescript
type ValidationErrors = Record<string, string | null>;

type ValidationError = {
  path: string;
  message: string;
};
```

## Features

### State Management

- **Reactive State**: Uses Nuxt's `useState` for persistent validation state
- **Global Access**: Validation state accessible across components
- **Type Safety**: Full TypeScript support with proper typing

### Error Handling

- **Object Support**: Accepts error objects with field paths
- **Array Support**: Accepts arrays of validation errors
- **Flexible Input**: Handles both object and array error formats

### Error Management

- **Set Errors**: Bulk error setting with object or array input
- **Clear All**: Remove all validation errors at once
- **Clear Specific**: Remove errors for specific fields
- **Reactive Updates**: Automatic UI updates when errors change

## Usage Examples

### Basic Form Validation

```vue
<script setup>
const { setErrors, clearErrors } = useValidate();

const formData = reactive({
  username: '',
  email: ''
});

const onSubmit = async () => {
  clearErrors();

  await $fetch('/api/register', { method: 'POST', body: formData.value })
    .then(() => console.log('Form submitted successfully'))
    .catch((error) => setErrors(error.data.validationErrors));
};
</script>

<template>
  <form @submit.prevent="onSubmit">
    <FormControl v-model="formData.name" name="name" label="Name" />

    <FormControl v-model="formData.email" name="email" type="email" label="Email" />

    <FormControl v-model="formData.password" name="password" type="password" label="Password" />

    <button type="submit" class="btn">Submit</button>
  </form>
</template>
```

## Technical Details

### State Management

- **Nuxt useState**: Uses Nuxt's `useState` for persistent state
- **Reactive Updates**: Automatic UI updates when validation state changes
- **Global Scope**: Validation state accessible across all components

### Error Format Support

```typescript
// Object format
setErrors({
  name: 'Name is required',
  email: 'Invalid email format'
});

// Array format
setErrors([
  { path: 'name', message: 'Name is required' },
  { path: 'email', message: 'Invalid email format' }
]);
```
