# useClipboard Composable

A Vue 3 composable that provides clipboard functionality with status feedback. Allows copying text to the clipboard and provides visual feedback about the operation status.

## Functions

| Function | Parameters     | Return Type     | Description                               |
| -------- | -------------- | --------------- | ----------------------------------------- |
| `copy`   | `text: string` | `Promise<void>` | Copies the provided text to the clipboard |

## Return Values

| Property     | Type                              | Description                        |
| ------------ | --------------------------------- | ---------------------------------- |
| `copy`       | `(text: string) => Promise<void>` | Function to copy text to clipboard |
| `status`     | `Ref<boolean>`                    | Reactive status true or false      |
| `statusText` | `Ref<string>`                     | Reactive status text               |

## Status Values

| Status  | Description                            |
| ------- | -------------------------------------- |
| `true`  | Text was successfully copied           |
| `false` | Copy operation failed or ready to copy |

## Status Text Values

| Status Text | Description                            |
| ----------- | -------------------------------------- |
| `'Copied!'` | Text was successfully copied           |
| `'Error'`   | Copy operation failed or ready to copy |
| `'Copy'`    | Default state, ready to copy           |

## Features

### Clipboard Operations

- **Text Copying**: Uses the modern `navigator.clipboard.writeText()` API
- **Error Handling**: Gracefully handles clipboard permission errors
- **Status Feedback**: Provides real-time status updates

### Status Management

- **Auto Reset**: Status automatically resets to 'Copy' after 2 seconds
- **Reactive**: Status is reactive and updates UI automatically
- **Error States**: Shows 'Error' status when copy fails

## Usage Examples

### Basic Copy Functionality

```vue
<script setup>
const { copy, status } = useClipboard();

const handleCopy = () => {
  copy('Text to copy to clipboard');
};
</script>

<template>
  <button @click="handleCopy" class="btn">
    {{ status }}
  </button>
</template>
```

### Copy with Dynamic Text

```vue
<script setup>
const { copy, status } = useClipboard();

const textToCopy = ref('Hello, World!');

const handleCopy = () => {
  copy(textToCopy.value);
};
</script>

<template>
  <div class="space-y-2">
    <input v-model="textToCopy" class="input" placeholder="Enter text to copy" />
    <button @click="handleCopy" class="btn">
      {{ status }}
    </button>
  </div>
</template>
```
