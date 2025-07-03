# dictionary Utility

A utility function that returns a display name/label by key from a dictionary file. Falls back to the original key if no name is found.

## Function Signature

```typescript
useDictionary(key: string): string
```

## Parameters

| Parameter | Type     | Description                   |
| --------- | -------- | ----------------------------- |
| `key`     | `string` | The dictionary key to look up |

## Return Value

Returns the display name/label if found in the dictionary, otherwise returns the original key.

## Features

### Name Lookup

- **Dictionary Integration**: Uses centralized dictionary file for field names and labels
- **Fallback Behavior**: Returns original key if name not found
- **Simple API**: Clean and straightforward function interface

### Field Labeling

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

### Table Headers

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
          {{ useDictionary(column.key) }}
        </th>
      </tr>
    </thead>
  </table>
</template>
```

## Dictionary File Structure

The dictionary file (`@/assets/dictionary.json`) should follow this structure:

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
  "action": "Action"
}
```

## Technical Details

### Implementation

- **JSON Import**: Imports dictionary from assets directory
- **Fallback Logic**: Returns original key if name missing

## Dependencies

- **Dictionary File**: `@/assets/dictionary.json` for field names and labels
