# Theme Plugin

A Nuxt plugin that provides automatic theme management with system preference detection, local storage persistence, and dynamic theme switching. Supports light, dark, and system themes with automatic color scheme adaptation.

## Overview

The theme plugin automatically manages your application's theme based on user preferences and system settings. It provides:

- **System Theme Detection**: Automatically detects and follows system color scheme preferences
- **Theme Persistence**: Saves theme preferences in local storage
- **Dynamic Switching**: Allows users to toggle between light and dark themes
- **Meta Tag Updates**: Updates HTML meta tags for proper theme indication
- **CSS Class Management**: Applies theme classes to the HTML element

## Configuration

### App Configuration

Configure the theme plugin in your `app.config.ts`:

```typescript
export default defineAppConfig({
  settings: {
    key: 'theme', // Local storage key for theme settings
    theme: 'system' // Default theme: 'light', 'dark', or 'system'
  }
});
```

### Theme Settings Type

```typescript
type ThemeSettings = {
  key: string; // Local storage key
  theme: 'light' | 'dark' | 'system'; // Current theme
  themeColor?: {
    light: string; // Light theme color (optional)
    dark: string; // Dark theme color (optional)
  };
};
```

## Features

### Theme Modes

- **Light Theme**: Traditional light background with dark text
- **Dark Theme**: Dark background with light text
- **System Theme**: Automatically follows system preference

### System Integration

- **Media Query Detection**: Uses `window.matchMedia('(prefers-color-scheme: dark)')`
- **Real-time Updates**: Automatically updates when system preference changes
- **Fallback Handling**: Graceful fallback to light theme if system detection fails

### Persistence

- **Local Storage**: Theme preferences persist across browser sessions
- **App-Specific Keys**: Uses configurable storage keys for multi-app support
- **Settings Restoration**: Automatically restores saved theme on page load

### Meta Tag Management

- **HTML Class**: Applies theme class to `<html>` element
- **Color Scheme**: Sets `color-scheme` meta tag
- **Theme Color**: Sets `theme-color` meta tag for browser UI

## Usage

### Basic Setup

The plugin is automatically loaded when the app starts. No additional setup required:

```typescript
// app.config.ts
export default defineAppConfig({
  settings: {
    key: 'theme',
    theme: 'system'
  }
});
```

### Theme Toggle

Access the theme toggle function through the plugin's provide:

```vue
<template>
  <button @click="$theme.toggleTheme" class="btn">Toggle Theme</button>
</template>
```

### Theme State Access

Access current theme state through app config:

```vue
<script setup>
const { settings } = useAppConfig();

const currentTheme = computed(() => settings.theme);
</script>

<template>
  <div>
    <p>Current theme: {{ currentTheme }}</p>
  </div>
</template>
```

### Custom Theme Colors

Configure custom theme colors in your app config:

```typescript
export default defineAppConfig({
  settings: {
    key: 'theme',
    theme: 'system',
    themeColor: {
      light: '#ffffff',
      dark: '#000000'
    }
  }
});
```

## CSS Integration

### Theme Classes

The plugin applies theme classes to the HTML element:

```html
<!-- Light theme -->
<html class="light"></html>

<!-- Dark theme -->
<html class="dark"></html>
```

### CSS Variables

The theme system uses CSS custom properties for colors:

```css
/* Light theme variables */
:root {
  --chroma: 0.1;
  --hue: 240;

  --color-newton: oklch(96% var(--chroma) var(--hue));
  --color-darwin: oklch(100% var(--chroma) var(--hue));
  --color-edison: oklch(92% var(--chroma) var(--hue));
  --color-surface: oklch(25% var(--chroma) var(--hue));
  --color-accent: var(--color-violet-500);
}

/* Dark theme variables */
:root:is(.dark) {
  --color-newton: oklch(16% var(--chroma) var(--hue));
  --color-darwin: oklch(20% var(--chroma) var(--hue));
  --color-edison: oklch(30% var(--chroma) var(--hue));
  --color-surface: oklch(97% var(--chroma) var(--hue));
}
```

### Component Usage

Use theme-aware classes in your components:

```vue
<template>
  <div class="bg-darwin text-surface">
    <h1 class="text-accent">Theme-aware content</h1>
    <p class="text-newton">This adapts to the current theme</p>
  </div>
</template>
```

## Advanced Usage

### Conditional Theme Logic

```vue
<script setup>
const { settings } = useAppConfig();

const isDark = computed(() => settings.theme === 'dark');
const isSystem = computed(() => settings.theme === 'system');

const getThemeIcon = () => {
  if (isSystem.value) return 'monitor';
  return isDark.value ? 'moon' : 'sun';
};
</script>

<template>
  <div class="theme-indicator">
    <AppIcon :name="getThemeIcon()" />
    <span v-if="isSystem">System</span>
    <span v-else>{{ isDark ? 'Dark' : 'Light' }}</span>
  </div>
</template>
```

## Plugin Lifecycle

### Initialization

1. **Plugin Load**: Plugin loads during Nuxt app initialization
2. **Config Check**: Validates theme configuration exists
3. **Storage Check**: Loads saved theme from local storage
4. **System Detection**: Detects system color scheme preference
5. **Theme Application**: Applies appropriate theme

### Runtime Behavior

1. **System Changes**: Listens for system theme preference changes
2. **User Toggle**: Handles manual theme switching
3. **Storage Updates**: Persists theme changes to local storage
4. **Meta Updates**: Updates HTML meta tags and classes

### Cleanup

- **Event Listeners**: Properly removes media query listeners
- **Storage Management**: Maintains clean storage state
- **Memory Management**: Efficient state management

## Technical Details

### Media Query Detection

```typescript
const colorScheme = window.matchMedia('(prefers-color-scheme: dark)');

colorScheme.addEventListener('change', (e: MediaQueryListEvent) => {
  settings.theme = e.matches ? 'dark' : 'light';
});
```

### Local Storage Integration

```typescript
const { setItem, getItem } = useLocalStorage();

// Save theme settings
setItem(settings.key, settings);

// Load saved settings
const savedSettings = getItem(settings.key);
```

### Meta Tag Management

```typescript
useHead({
  htmlAttrs: { class: () => settings.theme },
  meta: [
    { name: 'color-scheme', content: () => settings.theme },
    {
      name: 'theme-color',
      content: () =>
        settings.theme === 'dark' ? (settings?.themeColor?.dark ?? '#000') : (settings?.themeColor?.light ?? '#fff')
    }
  ]
});
```

### Plugin Provide

```typescript
return {
  provide: {
    theme: {
      toggleTheme
    }
  }
};
```

## Dependencies

- **useAppConfig**: For accessing theme configuration
- **useLocalStorage**: For theme persistence
- **useHead**: For meta tag management
