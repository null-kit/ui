# UI Components Layer

A comprehensive **Nuxt Layer** providing UI components with TypeScript support, theme management, and modern design patterns. Built with Tailwind CSS and optimized for developer experience.

## 📦 Installation

```bash
npm install @null-kit/ui
```

Then extend it in your `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  extends: [['@null-kit/ui', { install: true }]]
});
```

## 🎨 Quick Start

### 1. Configure Styles

```scss
// app.css
@import 'tailwindcss';

// import all components
@import '@null-kit/ui/all';

// or add seperately
@import '@null-kit/ui/table';
@import '@null-kit/ui/pagination';
@import '@null-kit/ui/modal';
@import '@null-kit/ui/tooltip';

// or import only source (for Tailwind to see the classes from components)
// and write own styles using registered class names (e.g. .form-control, .dropdown-content)
@import '@null-kit/ui/source';
```

### 2. Configure Theme

```typescript
// app.config.ts
export default defineAppConfig({
  settings: {
    key: 'theme',
    theme: 'system', // 'light', 'dark', or 'system'
    themeColor: {
      light: '#ffffff',
      dark: '#000000'
    }
  }
});
```

### 3. Use Components

```vue
<template>
  <div>
    <!-- Basic components -->
    <AppIcon name="sun" />

    <!-- Data components -->
    <AppTable :columns="data" />

    <AppPagination :total-pages="10" />

    <!-- Form components -->
    <FormControl v-model="email" type="email" name="email" label="Email" />

    <FormControl v-model="color" type="select" name="color" label="Color">
      <option value="red">Red</option>
      <option value="green">Green</option>
      <option value="blue">Blue</option>
    </FormControl>
  </div>
</template>
```

## 📚 Documentation

### App Components

Core application components for building user interfaces.

| Component             | Description                          | Documentation                                            |
| --------------------- | ------------------------------------ | -------------------------------------------------------- |
| **AppBadge**          | Status indicators and labels         | [📖 Badge](./docs/components/app/Badge.md)               |
| **AppDatepicker**     | Date selection with range support    | [📖 Datepicker](./docs/components/app/Datepicker.md)     |
| **AppDrawer**         | Slide-out side panels                | [📖 Drawer](./docs/components/app/Drawer.md)             |
| **AppDropdown**       | Contextual menus and overlays        | [📖 Dropdown](./docs/components/app/Dropdown.md)         |
| **AppIcon**           | SVG icon system                      | [📖 Icon](./docs/components/app/Icon.md)                 |
| **AppModal**          | Overlay dialogs and popups           | [📖 Modal](./docs/components/app/Modal.md)               |
| **AppPagination**     | Page navigation with URL sync        | [📖 Pagination](./docs/components/app/Pagination.md)     |
| **AppTable**          | Data tables with sorting and actions | [📖 Table](./docs/components/app/Table.md)               |
| **AppTabs**           | Tabbed content with URL state        | [📖 Tabs](./docs/components/app/Tabs.md)                 |
| **AppTooltip**        | Contextual help and information      | [📖 Tooltip](./docs/components/app/Tooltip.md)           |
| **AppTour**           | Guided tour system                   | [📖 Tour](./docs/components/app/Tour.md)                 |
| **AppChartArea**      | Area charts and line graphs          | [📖 Area](./docs/components/app/chart/Area.md)           |
| **AppChartCrosshair** | Interactive chart crosshairs         | [📖 Crosshair](./docs/components/app/chart/Crosshair.md) |
| **AppChartDonut**     | Donut and pie charts                 | [📖 Donut](./docs/components/app/chart/Donut.md)         |

### Form Components

Form controls and validation components.

| Component          | Description                   | Documentation                                         |
| ------------------ | ----------------------------- | ----------------------------------------------------- |
| **FormCheck**      | Checkboxes and radio buttons  | [📖 Check](./docs/components/form/Check.md)           |
| **FormCheckGroup** | Grouped checkboxes and radios | [📖 CheckGroup](./docs/components/form/CheckGroup.md) |
| **FormControl**    | Base form control wrapper     | [📖 Control](./docs/components/form/Control.md)       |
| **FormInput**      | Text input fields             | [📖 Input](./docs/components/form/Input.md)           |
| **FormSelect**     | Dropdown select menus         | [📖 Select](./docs/components/form/Select.md)         |
| **FormTreeSelect** | Hierarchical select menus     | [📖 TreeSelect](./docs/components/form/TreeSelect.md) |
| **FormValidate**   | Form validation display       | [📖 Validate](./docs/components/form/Validate.md)     |
| **FormEditor**     | Main rich text editor         | [📖 Editor](./docs/components/form/editor/Editor.md)  |

### Composables

Reusable Vue composables for common functionality.

| Composable       | Description                     | Documentation                                   |
| ---------------- | ------------------------------- | ----------------------------------------------- |
| **useClipboard** | Copy to clipboard functionality | [📖 Clipboard](./docs/composables/clipboard.md) |
| **useConfirm**   | Confirmation dialogs            | [📖 Confirm](./docs/composables/confirm.md)     |
| **useDraggable** | Drag and drop functionality     | [📖 Draggable](./docs/composables/draggable.md) |
| **useToast**     | Toast notifications             | [📖 Toast](./docs/composables/toast.md)         |
| **useTour**      | Guided tour management          | [📖 Tour](./docs/composables/tour.md)           |
| **useValidate**  | Form validation utilities       | [📖 Validate](./docs/composables/validate.md)   |

### Utilities

Helper functions and utilities.

| Utility          | Description               | Documentation                                     |
| ---------------- | ------------------------- | ------------------------------------------------- |
| **debounce**     | Function debouncing       | [📖 Debounce](./docs/utils/debounce.md)           |
| **dictionary**   | Key/value management      | [📖 Dictionary](./docs/utils/dictionary.md)       |
| **formatDate**   | Date formatting utility   | [📖 Format Date](./docs/utils/format-date.md)     |
| **formatNumber** | Number formatting utility | [📖 Format Number](./docs/utils/format-number.md) |
| **localStorage** | Local storage management  | [📖 Local Storage](./docs/utils/local-storage.md) |

### Plugins

Nuxt plugins for global functionality.

| Plugin           | Description                      | Documentation                       |
| ---------------- | -------------------------------- | ----------------------------------- |
| **Theme Plugin** | Theme management and persistence | [📖 Theme](./docs/plugins/theme.md) |

## 🎯 Common Use Cases

### Dashboard Layout

```vue
<template>
  <div class="bg-darwin min-h-screen">
    <!-- Header -->
    <header class="bg-surface text-newton p-4">
      <div class="flex items-center justify-between">
        <h1 class="text-xl font-bold">Dashboard</h1>
        <button @click="$theme.toggleTheme" class="btn">
          <AppIcon name="sun" />
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <main class="p-6">
      <!-- Data Table -->
      <AppTable :columns="users" sort-by="name,email">
        <template #actions="{ entry }">
          <button @click="editUser(entry)" class="btn btn-sm">Edit</button>
        </template>
      </AppTable>

      <!-- Pagination -->
      <AppPagination :total-pages="totalPages" />
    </main>
  </div>
</template>
```

### Form with Validation

```vue
<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <FormInput v-model="form.email" label="Email" name="email" required />

    <FormSelect v-model="form.country" label="Country" :options="countries" required />

    <FormCheck v-model="form.newsletter" label="Subscribe to newsletter" />

    <button type="submit" class="btn btn-primary">Submit</button>
  </form>
</template>
```

## 🎨 Theme System

The library includes a comprehensive theme system with automatic system preference detection.

### Theme Modes

- **Light**: Traditional light background with dark text
- **Dark**: Dark background with light text
- **System**: Automatically follows system preference

### CSS Variables

```css
/* Light theme */
:root {
  --color-newton: oklch(96% 0.1 240);
  --color-darwin: oklch(100% 0.1 240);
  --color-edison: oklch(92% 0.1 240);
  --color-surface: oklch(25% 0.1 240);
  --color-accent: var(--color-violet-500);
}

/* Dark theme */
:root:is(.dark) {
  --color-newton: oklch(16% 0.02 300);
  --color-darwin: oklch(20% 0.02 300);
  --color-edison: oklch(30% 0.02 300);
  --color-surface: oklch(97% 0.02 300);
}
```

### Theme Classes

Use theme-aware classes in your components:

```vue
<template>
  <div class="bg-darwin text-surface">
    <h1 class="text-accent">Theme-aware content</h1>
    <p class="text-newton">This adapts automatically</p>
  </div>
</template>
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
