# local-storage Utility

A utility composable that provides a safe and convenient interface for working with browser localStorage. Includes automatic JSON parsing/stringifying, error handling, and automatic cleanup of invalid data.

## Function Signature

```typescript
useLocalStorage(): {
  getItem: (key: string) => unknown;
  setItem: (key: string, data: unknown) => void;
}
```

## Return Value

Returns an object with two methods:

| Method    | Parameters                   | Return Type | Description                                        |
| --------- | ---------------------------- | ----------- | -------------------------------------------------- |
| `getItem` | `key: string`                | `unknown`   | Retrieves and parses data from localStorage        |
| `setItem` | `key: string, data: unknown` | `void`      | Stores data in localStorage with automatic cleanup |

## Features

### Data Management

- **Automatic JSON**: Handles JSON parsing and stringifying automatically
- **Type Safety**: Supports any serializable data type
- **Null Handling**: Automatically removes items when data is null/empty

### Error Handling

- **Parse Errors**: Gracefully handles JSON parsing errors
- **Invalid Data**: Automatically removes corrupted localStorage items
- **Console Logging**: Logs errors for debugging purposes

### Cleanup

- **Empty Arrays**: Automatically removes items with empty arrays
- **Null Values**: Removes items when data is null or undefined
- **Corrupted Data**: Removes items that can't be parsed

## Usage Examples

### Basic Usage

```vue
<script setup>
const { getItem, setItem } = useLocalStorage();

// Store data
setItem('user-preferences', { theme: 'dark', language: 'en' });

// Retrieve data
const preferences = getItem('user-preferences'); // Returns: { theme: 'dark', language: 'en' }
</script>
```

### User Preferences

```vue
<script setup>
const { getItem, setItem } = useLocalStorage();

const userPreferences = ref(getItem('user-preferences') || {
  theme: 'light',
  language: 'en',
  notifications: true
});

const updateTheme = (theme: string) => {
  userPreferences.value.theme = theme;
  setItem('user-preferences', userPreferences.value);
};

const updateLanguage = (language: string) => {
  userPreferences.value.language = language;
  setItem('user-preferences', userPreferences.value);
};
</script>

<template>
  <div>
    <select v-model="userPreferences.theme" @change="updateTheme(userPreferences.theme)">
      <option value="light">Light Theme</option>
      <option value="dark">Dark Theme</option>
    </select>

    <select v-model="userPreferences.language" @change="updateLanguage(userPreferences.language)">
      <option value="en">English</option>
      <option value="es">Spanish</option>
      <option value="fr">French</option>
    </select>
  </div>
</template>
```

### Form Data Persistence

```vue
<script setup>
const { getItem, setItem } = useLocalStorage();

const formData = ref(
  getItem('draft-form') || {
    name: '',
    email: '',
    message: ''
  }
);

// Auto-save form data
watch(formData, (newData) => setItem('draft-form', newData), { deep: true });

const submitForm = async () => {
  try {
    await submitFormData(formData.value);
    // Clear draft after successful submission
    setItem('draft-form', null);
    formData.value = { name: '', email: '', message: '' };
  } catch (error) {
    console.error('Form submission failed:', error);
  }
};
</script>

<template>
  <form @submit.prevent="submitForm">
    <input v-model="formData.name" placeholder="Name" />
    <input v-model="formData.email" type="email" placeholder="Email" />
    <textarea v-model="formData.message" placeholder="Message"></textarea>
    <button type="submit">Submit</button>
  </form>
</template>
```

## Technical Details

### Implementation

- **JSON Handling**: Automatic JSON.parse() and JSON.stringify()
- **Error Recovery**: Removes corrupted localStorage items
- **Type Safety**: Supports any serializable JavaScript data

### Error Handling

```typescript
try {
  const parsedItem = localStorage.getItem(key);
  if (parsedItem) return JSON.parse(parsedItem);
} catch (error) {
  console.error(error);
  localStorage.removeItem(key);
}
```

### Cleanup Logic

```typescript
if (!data || (Array.isArray(data) && data.length === 0)) {
  return localStorage.removeItem(key);
}
```

## Dependencies

- **localStorage**: Native browser storage API
