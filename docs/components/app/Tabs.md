# AppTabs Component

A flexible tabs component with URL state management, custom styling, and slot-based content rendering. Supports dynamic tab switching, URL synchronization, and customizable appearance.

## Props

| Prop            | Type       | Default                     | Description                                 |
| --------------- | ---------- | --------------------------- | ------------------------------------------- |
| `tabs`          | `string[]` | -                           | Array of tab names/labels                   |
| `tabsClass`     | `string`   | `'w-fit mb-4'`              | CSS classes for the tabs container          |
| `tabClass`      | `string`   | `'btn w-full'`              | CSS classes for individual tab buttons      |
| `tabInnerClass` | `string`   | `undefined`                 | CSS classes for tab button content          |
| `activeClass`   | `string`   | `'btn-default text-accent'` | CSS classes for the active tab              |
| `noQuery`       | `boolean`  | `false`                     | Disable URL query parameter synchronization |

## Slots

| Slot         | Props                   | Description                                |
| ------------ | ----------------------- | ------------------------------------------ |
| `tab-[name]` | `{ isActive: boolean }` | Custom tab button content for specific tab |
| `[tabName]`  | -                       | Content for each tab (normalized tab name) |

### Tab Button Slots

Custom slots for tab button content. The slot name should be `tab-[normalized-tab-name]`.

**Props:**

- `isActive: boolean` - Whether the tab is currently active

### Content Slots

Content slots for each tab. The slot name should match the normalized tab name.

**Features:**

- Only the active tab's content is rendered
- Slot name is automatically normalized (lowercase, hyphens instead of spaces/dots)

## Features

### Tab Management

- **Dynamic Tabs**: Array-based tab configuration
- **Active State**: Visual indication of current tab
- **Click Handling**: Smooth tab switching with click events
- **URL Integration**: Automatic URL query parameter synchronization

### URL State Management

- **Query Parameters**: Active tab stored in URL as `?tab=tab-name`
- **Persistent State**: Tab selection persists across page reloads
- **Clean URLs**: Removes tab parameter when on first tab
- **Optional**: Can be disabled with `noQuery` prop

### Customization

- **Flexible Styling**: Customizable CSS classes for all elements
- **Custom Content**: Slot-based tab button and content rendering
- **Responsive Design**: Adapts to different screen sizes
- **Accessibility**: Proper button semantics and keyboard navigation

### Content Rendering

- **Conditional Rendering**: Only renders active tab content
- **Slot-based**: Uses Vue slots for flexible content
- **Normalized Names**: Automatic tab name normalization for slot names

## Usage Examples

### Basic Tabs

```vue
<script setup>
const tabs = ['Overview', 'Details', 'Settings'];
</script>

<template>
  <AppTabs :tabs="tabs">
    <template #overview>
      <div class="p-4">
        <h2>Overview Content</h2>
        <p>This is the overview tab content.</p>
      </div>
    </template>

    <template #details>
      <div class="p-4">
        <h2>Details Content</h2>
        <p>This is the details tab content.</p>
      </div>
    </template>

    <template #settings>
      <div class="p-4">
        <h2>Settings Content</h2>
        <p>This is the settings tab content.</p>
      </div>
    </template>
  </AppTabs>
</template>
```

### Tabs with Custom Styling

```vue
<script setup>
const tabs = ['Profile', 'Security', 'Notifications'];
</script>

<template>
  <AppTabs :tabs="tabs" tabs-class="w-full mb-6" tab-class="btn btn-outline" active-class="btn-primary">
    <template #profile>
      <div class="rounded-lg bg-white p-6">
        <h2>Profile Settings</h2>
        <p>Manage your profile information.</p>
      </div>
    </template>

    <template #security>
      <div class="rounded-lg bg-white p-6">
        <h2>Security Settings</h2>
        <p>Manage your account security.</p>
      </div>
    </template>

    <template #notifications>
      <div class="rounded-lg bg-white p-6">
        <h2>Notification Preferences</h2>
        <p>Configure your notification settings.</p>
      </div>
    </template>
  </AppTabs>
</template>
```

### Custom Tab Button Content

```vue
<script setup>
const tabs = ['Dashboard', 'Analytics', 'Reports'];
</script>

<template>
  <AppTabs :tabs="tabs">
    <!-- Custom tab button for Dashboard -->
    <template #tab-dashboard="{ isActive }">
      <div class="flex items-center gap-2">
        <AppIcon name="dashboard" />
        <span :class="{ 'font-bold': isActive }">Dashboard</span>
      </div>
    </template>

    <!-- Custom tab button for Analytics -->
    <template #tab-analytics="{ isActive }">
      <div class="flex items-center gap-2">
        <AppIcon name="chart-bar" />
        <span :class="{ 'font-bold': isActive }">Analytics</span>
      </div>
    </template>

    <!-- Custom tab button for Reports -->
    <template #tab-reports="{ isActive }">
      <div class="flex items-center gap-2">
        <AppIcon name="chart-bar" />
        <span :class="{ 'font-bold': isActive }">Reports</span>
      </div>
    </template>

    <!-- Tab content -->
    <template #dashboard>
      <div class="p-4">
        <h2>Dashboard</h2>
        <p>Your dashboard overview.</p>
      </div>
    </template>

    <template #analytics>
      <div class="p-4">
        <h2>Analytics</h2>
        <p>Analytics and insights.</p>
      </div>
    </template>

    <template #reports>
      <div class="p-4">
        <h2>Reports</h2>
        <p>Generate and view reports.</p>
      </div>
    </template>
  </AppTabs>
</template>
```

## Tab Name Normalization

The component automatically normalizes tab names for slot usage:

| Original Tab Name     | Normalized Slot Name |
| --------------------- | -------------------- |
| `"Overview"`          | `overview`           |
| `"User Profile"`      | `user-profile`       |
| `"API.Docs"`          | `api-docs`           |
| `"Settings & Config"` | `settings-config`    |

**Normalization Rules:**

- Convert to lowercase
- Replace spaces and dots with hyphens
- Trim whitespace

## URL Query Parameters

When `noQuery` is `false` (default), the component manages this URL query parameter:

| Parameter | Type     | Description                  |
| --------- | -------- | ---------------------------- |
| `tab`     | `string` | Active tab name (normalized) |

### Example URLs

```
/page                    // First tab (no query parameter)
/page?tab=overview       // Overview tab
/page?tab=user-profile   // User Profile tab
/page?tab=api-docs       // API.Docs tab
```

### Custom Styling Examples

```vue
<!-- Full-width tabs -->
<AppTabs :tabs="tabs" tabs-class="w-full mb-6" tab-class="btn btn-outline" active-class="btn-primary" />

<!-- Compact tabs -->
<AppTabs :tabs="tabs" tabs-class="w-fit mb-4" tab-class="btn btn-sm" active-class="bg-blue-500 text-white" />

<!-- Custom tab content styling -->
<AppTabs :tabs="tabs" tab-inner-class="text-sm font-medium" />
```

## Technical Details

### State Management

- **Reactive Props**: Watches for changes in tabs array
- **URL Synchronization**: Automatically syncs with URL query parameters
- **Default Selection**: Falls back to first tab if no URL parameter
- **Validation**: Ensures selected tab exists in tabs array

### Navigation Behavior

- **Click Handling**: Updates active tab and URL on click
- **URL Updates**: Uses Vue Router for navigation
- **Page Reset**: Clears page parameter when switching tabs
- **Validation**: Redirects to first tab if invalid tab in URL
