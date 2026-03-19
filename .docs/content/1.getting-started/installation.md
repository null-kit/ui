---
title: Installation
description: Get started with null-kit
navigation:
  icon: i-lucide-download
seo:
  title: Installation
  description: Get started with null-kit
---

::steps

### Install layer

<!-- prettier-ignore-start -->
::tabs
  :::tabs-item{icon="simple-icons-github" label="Github"}
  ```ts [nuxt.config.ts]
  export default defineNuxtConfig({
    extends: [['github:null-kit/ui', { install: true }]]
  });
  ```
  :::

  :::tabs-item{icon="eva:npm-outline" label="npm"}
    ::code-group
    ```bash [npm]
    npm install @null-kit/ui
    ```
    ```bash [pnpm]
    pnpm add @null-kit/ui
    ```
    ```bash [bun]
    bun add @null-kit/ui
    ```
    ```bash [yarn]
    yarn add @null-kit/ui
    ```
    ::

    ```ts [nuxt.config.ts]
    export default defineNuxtConfig({
      extends: [['@null-kit/ui', { install: true }]]
    });
    ```
  :::
::
<!-- prettier-ignore-end -->

### Import Kit

<!-- prettier-ignore-start -->
::tabs
  :::tabs-item{label="All default styles"}
  ```scss [app.css]
  @import 'tailwindcss';
  @import '@null-kit/ui/all';
  ```
  :::

  :::tabs-item{label="Only required"}
  ::::note
  Import only the default styles for the components needed
  ::::

  ```scss [app.css]
  @import 'tailwindcss';
  @import '@null-kit/ui/source';
  @import '@null-kit/ui/loading';
  @import '@null-kit/ui/button';
  @import '@null-kit/ui/input';
  @import '@null-kit/ui/select';
  @import '@null-kit/ui/table';
  @import '@null-kit/ui/dropdown';
  @import '@null-kit/ui/tooltip';
  @import '@null-kit/ui/modal';
  @import '@null-kit/ui/drawer';
  @import '@null-kit/ui/chart';
  @import '@null-kit/ui/datepicker';
  @import '@null-kit/ui/toast';
  ```
  :::

  :::tabs-item{label="Full customization"}
  ::::note
  Import only source (for Tailwind to see the classes from components) and write own styles using registered class names  (e.g. .form-control, .dropdown-content)
  ::::

  ```scss [app.css]
  @import 'tailwindcss';
  @import '@null-kit/ui/source';
  ```
  :::
::

### Configure Colors

```scss [app.css]
@theme {
    --color-newton: oklch(97% 0.007 280);
    --color-darwin: oklch(100% 0 280);
    --color-edison: oklch(88% 0.007 280);
    --color-surface: oklch(5% 0.007 280);
    --color-accent: var(--color-violet-700);
}

@layer theme {
    :is(.dark) {
      --color-newton: oklch(21% 0.02 280);
      --color-darwin: oklch(24% 0.02 280);
      --color-edison: oklch(32% 0.02 280);
      --color-surface: oklch(95% 0.02 280);
      --color-accent: var(--color-violet-500);
    }
}
```
<!-- prettier-ignore-end -->

### Configure Theme

<!-- prettier-ignore -->
```ts [app.config.ts]
export default defineAppConfig({
    settings: {
      key: 'dashboard',
      theme: 'system', // 'light', 'dark', 'system'
      themeColor: {
        light: '#ffffff',
        dark: '#000000'
      }
    }
});
```

### Start Build 🚀
