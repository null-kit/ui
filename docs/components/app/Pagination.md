# AppPagination Component

A flexible pagination component with URL state management, page navigation, and items per page selection. Supports smooth scrolling, responsive design, and automatic URL synchronization.

## Props

| Prop         | Type     | Default | Description                                          |
| ------------ | -------- | ------- | ---------------------------------------------------- |
| `totalPages` | `number` | -       | Total number of pages to paginate through            |
| `scrollTo`   | `string` | -       | CSS selector for element to scroll to on page change |

## Features

### Navigation

- **Previous/Next Buttons**: Navigate between pages with arrow buttons
- **Page Numbers**: Direct navigation to specific pages
- **Smart Pagination**: Shows ellipsis (...) for large page ranges
- **Responsive Design**: Page numbers hidden on mobile, visible on desktop

### URL State Management

- **Automatic Sync**: Page state automatically syncs with URL query parameters
- **Clean URLs**: Removes page parameter when on first page
- **Persistent State**: Page selection persists across page reloads

### Items Per Page

- **Per Page Selector**: Dropdown to select items per page (25, 50, 100, 500, 1000)
- **URL Integration**: Per page selection also syncs with URL
- **Auto Reset**: Resets to page 1 when changing items per page

## Usage Examples

### Basic Pagination

```vue
<script setup>
const totalPages = ref(10);
</script>

<template>
  <AppPagination :total-pages="totalPages" />
</template>
```

### Pagination with Custom Scroll Target

```vue
<script setup>
const totalPages = ref(15);
</script>

<template>
  <div>
    <div id="content">
      <!-- Your content here -->
    </div>

    <AppPagination :total-pages="totalPages" scroll-to="#content" />
  </div>
</template>
```

### Integration with Data Fetching

```vue
<script setup>
const route = useRoute();
const {
  data: users,
  pending,
  error
} = await useFetch('/api/users', {
  query: {
    page: route.query.page || 1,
    perPage: route.query.perPage || 25
  }
});
</script>

<template>
  <div>
    <AppTable :columns="users.data" />

    <AppPagination :total-pages="users.totalPages" />
  </div>
</template>
```

## URL Query Parameters

The component automatically manages these URL query parameters:

| Parameter | Type     | Description                             |
| --------- | -------- | --------------------------------------- |
| `page`    | `number` | Current page number (removed if page 1) |
| `perPage` | `number` | Items per page (removed if default 25)  |

### Example URLs

```
/users                    // Page 1, 25 items per page
/users?page=3            // Page 3, 25 items per page
/users?perPage=50        // Page 1, 50 items per page
/users?page=5&perPage=100 // Page 5, 100 items per page
```

## Pagination Logic

### Page Range Display

The component intelligently displays page numbers based on the current page:

- **Always shows**: Current page and adjacent pages
- **Ellipsis**: Shows "..." when there are gaps in the sequence
- **First/Last**: Always shows first and last page numbers
- **Mobile**: Hides page numbers on small screens for better UX

## Technical Details

### State Management

- **Reactive Props**: Watches for changes in `totalPages`
- **URL Synchronization**: Automatically updates URL on page/perPage changes
- **Default Values**: Falls back to page 1 and 25 items per page

### Navigation Behavior

- **Previous Button**: Only shows when current page >= 2
- **Next Button**: Only shows when current page < total pages
- **Page Numbers**: Only shows when total pages >= 2
- **Disabled States**: Proper pointer-events-none for non-clickable elements

### Scroll Behavior

- **Smooth Scrolling**: Uses `scrollIntoView({ behavior: 'smooth' })`
- **Optional Target**: Only scrolls if `scrollTo` prop is provided
- **Element Selection**: Uses `document.querySelector()` to find target

## Dependencies

- **FormSelect**: For items per page selection
