# format-number Utility

A utility function for formatting numbers with locale support, currency formatting, and flexible configuration. Uses the native Intl.NumberFormat API for consistent and localized number formatting.

## Function Signature

```typescript
formatNumber(
  value: number | string,
  options?: NumberOptions
): string
```

## Parameters

| Parameter | Type               | Default | Description                         |
| --------- | ------------------ | ------- | ----------------------------------- |
| `value`   | `number \| string` | -       | Number to format (number or string) |
| `options` | `NumberOptions`    | `{}`    | Formatting options object           |

## NumberOptions Interface

```typescript
type NumberOptions = {
  currency?: string;
  options?: Intl.NumberFormatOptions;
  locale?: string;
};
```

| Option     | Type                       | Default   | Description                           |
| ---------- | -------------------------- | --------- | ------------------------------------- |
| `currency` | `string`                   | -         | Currency code for currency formatting |
| `options`  | `Intl.NumberFormatOptions` | -         | Custom Intl.NumberFormat options      |
| `locale`   | `string`                   | `'en-US'` | Locale for number formatting          |

## Return Value

Returns a formatted number string based on the provided options.

## Features

### Number Formatting

- **Locale Support**: Multiple locale support for different number formats
- **Currency Formatting**: Automatic currency symbol and formatting
- **Custom Options**: Full Intl.NumberFormat options support
- **String Input**: Accepts both numbers and strings

### Currency Support

- **Currency Codes**: Standard ISO currency codes (USD, EUR, GBP, etc.)
- **Automatic Symbols**: Currency symbols based on locale
- **Proper Formatting**: Currency-specific formatting rules

### Input Flexibility

- **Number Input**: Accepts JavaScript numbers
- **String Input**: Accepts string numbers (converted automatically)
- **Type Safety**: TypeScript support with proper typing

## Usage Examples

### Basic Number Formatting

```typescript
// Basic formatting
formatNumber(1234.56); // "1,234.56"

// Large numbers
formatNumber(1234567.89); // "1,234,567.89"

// String input
formatNumber('1234.56'); // "1,234.56"
```

### Currency Formatting

```typescript
// US Dollar
formatNumber(1234.56, { currency: 'USD' }); // "$1,234.56"

// Euro
formatNumber(1234.56, { currency: 'EUR' }); // "€1,234.56"
```

### Different Locales

```typescript
const value = 1234.56;

// US English
formatNumber(value, { locale: 'en-US' }); // "1,234.56"

// German
formatNumber(value, { locale: 'de-DE' }); // "1.234,56"
```

### Custom Formatting Options

```typescript
// Minimum fraction digits
formatNumber(1234.5, {
  options: { minimumFractionDigits: 2 }
}); // "1,234.50"

// Maximum fraction digits
formatNumber(1234.567, {
  options: { maximumFractionDigits: 2 }
}); // "1,234.57"

// Percentage
formatNumber(0.1234, {
  options: { style: 'percent' }
}); // "12.34%"

// Scientific notation
formatNumber(1234.56, {
  options: { notation: 'scientific' }
}); // "1.23456E3"
```

### Percentage Display

```vue
<script setup>
const metrics = reactive([
  { name: 'Conversion Rate', value: 0.0456 },
  { name: 'Growth Rate', value: 0.1234 },
  { name: 'Success Rate', value: 0.9876 }
]);

const formatPercentage = (value: number) => {
  return formatNumber(value, {
    options: { style: 'percent', minimumFractionDigits: 2 }
  });
};
</script>

<template>
  <div v-for="metric in metrics" :key="metric.name">
    <span>{{ metric.name }}:</span>
    <span class="font-bold">{{ formatPercentage(metric.value) }}</span>
  </div>
</template>
```

## Technical Details

### Implementation

- **Intl.NumberFormat**: Uses native browser internationalization API
- **Type Conversion**: Automatic conversion of string numbers
- **Currency Detection**: Automatic currency formatting when currency code provided

### Default Options

```typescript
const defaultOptions: Intl.NumberFormatOptions = currency ? { style: 'currency', currency } : {};
```

## Dependencies

- **Intl.NumberFormat**: Native browser internationalization API
