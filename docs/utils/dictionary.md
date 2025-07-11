# Dictionary Utility

A utility function that provides centralized label management for consistent naming across the application. It supports both flat and nested key structures with intelligent fallback behavior.

## Function Signature

```typescript
useDictionary(key: string): string
```

## Parameters

| Parameter | Type     | Description                                                           |
| --------- | -------- | --------------------------------------------------------------------- |
| `key`     | `string` | The dictionary key to look up (supports dot notation for nested keys) |

## Return Value

Returns the display name/label if found in the dictionary, otherwise returns the original key as fallback.

## Features

### Key Resolution

- **Flat Keys**: Direct key lookup (e.g., `"email"` → `"Email"`)
- **Nested Keys**: Dot notation for grouped keys (e.g., `"table.users.name"` → looks for `table.users.name`)
- **Fallback Logic**: Multiple fallback strategies for maximum compatibility
- **Type Safety**: Full TypeScript support

### Fallback Behavior

The utility implements a sophisticated fallback system:

1. **Direct Match**: `key` exists in root dictionary
2. **Nested Match**: `group.groupKey` exists in nested structure
3. **Group Key Fallback**: `groupKey` exists in root dictionary
4. **Original Key**: Returns the original key if no match found

### Centralized Management

- **Consistent Naming**: Provides consistent field names across the application
- **Key-based System**: Uses consistent keys for field identification
- **Maintainable**: Centralized name management

## Usage Examples

### Basic Field Label

```vue
<template>
  <label>{{ useDictionary('email') }}</label>
  <input type="email" />
</template>
```

### Table Headers with Nested Keys

```vue
<script setup>
const columns = [
  { key: 'id', sortable: true },
  { key: 'name', sortable: true },
  { key: 'email', sortable: false },
  { key: 'status', sortable: true }
];
</script>

<template>
  <table>
    <thead>
      <tr>
        <th v-for="column in columns" :key="column.key">
          {{ useDictionary(`users.${column.key}`) }}
        </th>
      </tr>
    </thead>
  </table>
</template>
```

## Dictionary File Structure

The dictionary file (`/assets/dictionary.json`) should follow this structure:

```json
{
  "id": "#",
  "name": "Name",
  "email": "Email",
  "date": "Date",
  "createdAt": "Created",
  "updatedAt": "Updated",
  "lastLoginAt": "Last Login",
  "type": "Type",
  "status": "Status",
  "action": "Action",
  "users": {
    "name": "Full Name"
  }
}
```

## Technical Details

### Implementation

- **JSON Import**: Imports dictionary from assets directory
- **Fallback Logic**: Returns original key if name missing

## Dependencies

- **Dictionary File**: `/assets/dictionary.json` for field names and labels
