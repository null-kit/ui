# AppIcon Component

A dynamic SVG icon component that loads icons from the assets directory and automatically applies consistent styling. Supports icon caching, automatic sizing, and currentColor inheritance.

## Props

| Prop   | Type     | Default | Description                                        |
| ------ | -------- | ------- | -------------------------------------------------- |
| `name` | `string` | -       | Name of the SVG icon file (without .svg extension) |

## Features

### Icon Loading

- **Dynamic Import**: Loads SVG files dynamically from `@/assets/img/svg/` directory
- **Caching**: Icons are cached in memory for better performance
- **Error Handling**: Gracefully handles missing icons with console error
- **Raw SVG**: Uses Vite's `?raw` import for direct SVG content

### Styling

- **Current Color**: Automatically replaces fill colors with `currentColor` for theme compatibility
- **Responsive Sizing**: Sets width and height to 100% for flexible scaling
- **Default Size**: Applies `size-4` class by default (16x16px)
- **Custom Sizing**: Allows custom size classes via the `class` attribute

### Performance

- **Lazy Loading**: Icons are loaded only when needed
- **Memory Cache**: Prevents repeated imports of the same icon
- **Clean SVG**: Removes unnecessary whitespace and newlines

## Usage Examples

### Basic Icon

```vue
<AppIcon name="check" />
```

### Icon with Custom Styles

```vue
<AppIcon name="star" class="size-6 text-green-500" />
<AppIcon name="chevron-right" class="size-8" />
```

### Icon in Button

```vue
<button class="btn">
  <AppIcon name="star" />
  Bold
</button>
```

## Available Icons

The component supports all SVG files in the `@/assets/img/svg/` directory.

## Styling

The component uses these CSS classes:

- `block`: Makes the icon a block element
- `shrink-0`: Prevents the icon from shrinking
- `size-4`: Default size (16x16px) - applied automatically unless custom size is provided

## Technical Details

### SVG Processing

The component automatically processes SVG files:

1. **Removes newlines** for cleaner output
2. **Sets responsive dimensions** (width="100%" height="100%")
3. **Replaces fill colors** with `currentColor` for theme compatibility
4. **Caches processed content** for performance

### Error Handling

- **Missing Icons**: Logs error to console and renders empty content
- **Import Failures**: Gracefully handles failed dynamic imports
- **Invalid Names**: Safely handles malformed icon names
