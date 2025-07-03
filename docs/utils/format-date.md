# format-date Utility

A utility function for formatting dates with multiple format options, locale support, and flexible configuration. Supports various date formats including short, long, and ISO formats.

## Function Signature

```typescript
formatDate(
  date: Date | string | null,
  options?: DateOptions
): string
```

## Parameters

| Parameter | Type                     | Default | Description                                   |
| --------- | ------------------------ | ------- | --------------------------------------------- |
| `date`    | `Date \| string \| null` | -       | Date to format (Date object, string, or null) |
| `options` | `DateOptions`            | `{}`    | Formatting options object                     |

## DateOptions Interface

```typescript
type DateOptions = {
  format?: 'short' | 'long' | 'iso';
  time?: boolean;
  year?: boolean;
  options?: Intl.DateTimeFormatOptions;
  locale?: string;
};
```

| Option    | Type                         | Default   | Description                           |
| --------- | ---------------------------- | --------- | ------------------------------------- |
| `format`  | `'short' \| 'long' \| 'iso'` | `'short'` | Predefined format style               |
| `time`    | `boolean`                    | `false`   | Whether to include time in the output |
| `year`    | `boolean`                    | `true`    | Whether to include year in the output |
| `options` | `Intl.DateTimeFormatOptions` | -         | Custom Intl.DateTimeFormat options    |
| `locale`  | `string`                     | `'en-US'` | Locale for date formatting            |

## Return Value

Returns a formatted date string, or `'N/A'` if the date is null or invalid.

## Features

### Format Options

- **Short Format**: Compact date format (e.g., "Jan 15, 2024")
- **Long Format**: Full date format (e.g., "January 15, 2024")
- **ISO Format**: ISO date string (e.g., "2024-01-15")

### Customization

- **Time Display**: Optional time inclusion
- **Year Display**: Optional year inclusion
- **Locale Support**: Multiple locale support
- **Custom Options**: Full Intl.DateTimeFormat options support

### Input Flexibility

- **Date Objects**: Accepts JavaScript Date objects
- **Date Strings**: Accepts date strings (parsed automatically)
- **Null Handling**: Graceful handling of null/undefined values

## Usage Examples

### Basic Date Formatting

```typescript
const date = new Date('2024-01-15');

// Default short format
formatDate(date); // "Jan 15, 2024"

// Long format
formatDate(date, { format: 'long' }); // "January 15, 2024"

// ISO format
formatDate(date, { format: 'iso' }); // "2024-01-15"
```

### Date with Time

```typescript
const date = new Date('2024-01-15T14:30:00');

// Include time
formatDate(date, { time: true }); // "Jan 15, 2024, 2:30 PM"

// Long format with time
formatDate(date, { format: 'long', time: true }); // "January 15, 2024, 2:30 PM"
```

### Different Locales

```typescript
const date = new Date('2024-01-15');

// US English
formatDate(date, { locale: 'en-US' }); // "Jan 15, 2024"

// German
formatDate(date, { locale: 'de-DE' }); // "15. Jan. 2024"
```

### Custom Formatting

```typescript
const date = new Date('2024-01-15');

// Custom options
formatDate(date, {
  options: {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }
}); // "Monday, January 15, 2024"

// Weekday only
formatDate(date, {
  options: {
    weekday: 'short'
  }
}); // "Mon"
```

### String Date Input

```typescript
formatDate('2024-01-15'); // "Jan 15, 2024"
formatDate('2024-01-15T10:30:00Z'); // "Jan 15, 2024"
formatDate('01/15/2024'); // "Jan 15, 2024"
```

### Null and Invalid Date Handling

```typescript
formatDate(null); // "N/A"

formatDate('invalid-date'); // "N/A"
```

## Technical Details

### Implementation

- **Intl.DateTimeFormat**: Uses native browser internationalization API
- **Date Parsing**: Automatic parsing of string dates
- **Error Handling**: Graceful handling of invalid dates

### Default Options

```typescript
const defaultOptions: Intl.DateTimeFormatOptions = {
  hourCycle: 'h24',
  month: format === 'long' ? 'long' : 'short',
  day: 'numeric',
  ...(time ? { hour: 'numeric', minute: 'numeric' } : {}),
  ...(year ? { year: 'numeric' } : {})
};
```

## Dependencies

- **Intl.DateTimeFormat**: Native browser internationalization API
