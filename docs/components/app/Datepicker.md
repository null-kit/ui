# AppDatepicker Component

A flexible date picker component with range selection, preset options, and date mode functionality. Supports single date selection, date ranges, disabled dates, and ISO format output.

## Props

| Prop            | Type                                                                    | Default | Description                             |
| --------------- | ----------------------------------------------------------------------- | ------- | --------------------------------------- |
| `range`         | `boolean`                                                               | `false` | Enable date range selection             |
| `disabledDates` | `Date[]`                                                                | `[]`    | Array of dates that cannot be selected  |
| `dateMode`      | `boolean \| 'short'`                                                    | -       | Enable date mode with grouping options  |
| `iso`           | `boolean`                                                               | `false` | Output dates in ISO format (YYYY-MM-DD) |
| `preset`        | `'today' \| 'yesterday' \| 'last-week' \| 'this-month' \| 'last-month'` | -       | Pre-select a date range                 |

## Model

| Model          | Type                                   | Description                                       |
| -------------- | -------------------------------------- | ------------------------------------------------- |
| `v-model`      | `Date \| Date[]`                       | Selected date(s) - single date or array for range |
| `v-model:mode` | `'day' \| 'hour' \| 'week' \| 'month'` | Date grouping mode (only with `dateMode`)         |

## Features

### Date Selection

- **Single Date**: Select a single date with visual feedback
- **Date Range**: Select start and end dates with range highlighting
- **Visual Indicators**: Selected dates, range highlighting, disabled states
- **Month Navigation**: Previous/next month buttons and dropdown selectors

### Date Mode

- **Grouping Options**: Group by hour, day, week, or month
- **Mode Selector**: Dropdown to change grouping mode
- **Short Mode**: Limited options for compact layouts

### Preset Options

- **Quick Selection**: Today, This Month, Last Week, Last Month
- **Range Presets**: Automatically sets start and end dates
- **Convenient**: One-click date range selection

### Formatting

- **ISO Output**: Optional ISO format (YYYY-MM-DD) for API compatibility
- **Localized Display**: Uses browser's locale for date formatting
- **Range Display**: Shows date range as "Start - End" format

### Accessibility

- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: Proper ARIA labels and titles
- **Visual Feedback**: Clear visual states for all interactions

## Usage Examples

### Basic Date Selection

```vue
<script setup>
const selectedDate = ref(new Date());
</script>

<template>
  <AppDatepicker v-model="selectedDate" />
</template>
```

### Date Range Selection

```vue
<script setup>
const dateRange = ref([new Date(), new Date()]);
</script>

<template>
  <AppDatepicker v-model="dateRange" :range="true" />
</template>
```

### Date Range with Preset

```vue
<script setup>
const dateRange = ref([]);
</script>

<template>
  <AppDatepicker v-model="dateRange" :range="true" preset="this-month" />
</template>
```

### Date Mode with Grouping

```vue
<script setup>
const selectedDate = ref(new Date());
const dateMode = ref('day');
</script>

<template>
  <AppDatepicker v-model="selectedDate" v-model:mode="dateMode" :date-mode="true" />
</template>
```

### ISO Format Output

```vue
<script setup>
const selectedDate = ref(new Date());
</script>

<template>
  <AppDatepicker v-model.iso="selectedDate" />
</template>
```

### Disabled Dates

```vue
<script setup>
const selectedDate = ref(new Date());
const disabledDates = ref([
  new Date('2024-01-01'), // New Year
  new Date('2024-12-25') // Christmas
]);
</script>

<template>
  <AppDatepicker v-model="selectedDate" :disabled-dates="disabledDates" />
</template>
```

### Short Date Mode

```vue
<script setup>
const selectedDate = ref(new Date());
const dateMode = ref('day');
</script>

<template>
  <AppDatepicker v-model="selectedDate" v-model:mode="dateMode" date-mode="short" />
</template>
```

## Date Mode Options

When `dateMode` is enabled, the component provides a mode selector with these options:

| Mode    | Description         | Available When    |
| ------- | ------------------- | ----------------- |
| `hour`  | Group data by hour  | Always            |
| `day`   | Group data by day   | Always            |
| `week`  | Group data by week  | Not in short mode |
| `month` | Group data by month | Not in short mode |

## Preset Options

Quick date range selection options:

| Preset       | Description                            |
| ------------ | -------------------------------------- |
| `today`      | Selects today's date (single or range) |
| `yesterday`  | Selects yesterday's date               |
| `last-week`  | Last 7 days from today                 |
| `this-month` | Current month (1st to last day)        |
| `last-month` | Previous month (1st to last day)       |

## Formatting Options

### ISO Format

When `iso` prop is enabled, dates are output in ISO format:

### Display Format

The component uses the `formatDate` utility for display formatting:

- **Single Date**: "Jan 15, 2024"
- **Date Range**: "Jan 1, 2024 - Jan 31, 2024"
- **Placeholder**: "Select date" or "Select dates"

## Technical Details

### Date Calculation

- **Month Grid**: Dynamically calculates calendar grid for each month
- **Week Start**: Uses Monday as first day of week
- **Year Range**: Shows 10 years (current year ± 5)
- **Disabled Logic**: Compares dates using `toDateString()` for accuracy

### State Management

- **Reactive Props**: Watches for changes in all props
- **Model Synchronization**: Automatically syncs with v-model
- **Preset Handling**: Applies presets on mount if provided
- **Mode Default**: Sets default mode to 'day' when dateMode is enabled

### Navigation

- **Month Navigation**: Previous/next month with year rollover
- **Year/Month Selectors**: Dropdown selectors for quick navigation
- **Current Date**: Automatically navigates to selected date

## Dependencies

- **AppDropdown**: For dropdown functionality
- **AppIcon**: For calendar icon display
- **FormControl**: For mode selector dropdown
- **formatDate**: Utility for date formatting
