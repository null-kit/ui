# debounce Utility

A TypeScript utility function that creates a debounced version of any function. Useful for limiting the rate at which a function can be called, especially for performance optimization in search inputs, scroll handlers, and resize events.

## Function Signature

```typescript
debounce<F extends (...args: Parameters<F>) => ReturnType<F>>(
  func: F,
  ms?: number
): (...args: Parameters<F>) => void
```

## Parameters

| Parameter | Type     | Default | Description                                     |
| --------- | -------- | ------- | ----------------------------------------------- |
| `func`    | `F`      | -       | The function to debounce                        |
| `ms`      | `number` | `300`   | Delay in milliseconds before executing function |

## Return Value

Returns a debounced function that:

- **Delays Execution**: Waits for the specified delay before executing
- **Cancels Previous**: Cancels any pending execution when called again
- **Preserves Types**: Maintains the original function's parameter and return types

## Features

### Type Safety

- **Generic Types**: Preserves original function's parameter and return types
- **TypeScript Support**: Full type inference and checking
- **Parameter Preservation**: Maintains exact parameter structure

### Performance

- **Timeout Management**: Properly clears and sets timeouts
- **Memory Efficient**: No memory leaks from uncleared timeouts
- **Optimized Execution**: Only executes after the delay period

## Usage Examples

### Basic Debouncing

```typescript
const expensiveFunction = (searchTerm: string) => {
  console.log('Searching for:', searchTerm);
  // Expensive search operation
};

const debouncedSearch = debounce(expensiveFunction, 500);

debouncedSearch();
```

### Search Input Handler

```vue
<script setup>
const searchTerm = ref('');
const searchResults = ref([]);

const performSearch = async (term: string) => {
  searchResults.value = await $fetch(`/api/search?q=${term}`);
};

const debouncedSearch = debounce(performSearch, 300);

watch(searchTerm, (newTerm) => debouncedSearch(newTerm));
</script>

<template>
  <input v-model="searchTerm" placeholder="Search..." />
  <div v-for="result in searchResults" :key="result.id">
    {{ result.title }}
  </div>
</template>
```

### Scroll Event Handler

```vue
<script setup>
const handleScroll = () => {
  console.log('Scroll position:', window.scrollY);
  // Update scroll-based UI elements
};

const debouncedScroll = debounce(handleScroll, 100);

onMounted(() => {
  window.addEventListener('scroll', debouncedScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', debouncedScroll);
});
</script>
```

## Technical Details

### Implementation

- **Timeout Management**: Uses `setTimeout` and `clearTimeout` for delay control
- **Closure Pattern**: Maintains timeout reference in closure scope
- **Parameter Forwarding**: Preserves all original function parameters
