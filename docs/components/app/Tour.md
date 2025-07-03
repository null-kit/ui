# AppTour Component

A guided tour component that creates interactive walkthroughs for your application. Features floating tooltips, step-by-step navigation, and automatic element targeting with smooth scrolling and positioning.

## Props

| Prop     | Type         | Description                                   |
| -------- | ------------ | --------------------------------------------- |
| `steps`  | `TourStep[]` | Array of tour steps with content and behavior |
| `target` | `string`     | Unique identifier for the tour instance       |

## TourStep Type

```typescript
type TourStep = {
  title: string; // Step title
  text: string; // Step description (supports HTML)
  placement?: Placement; // Tooltip placement relative to target
  prevButton?: boolean; // Show/hide previous button
  nextButton?: boolean; // Show/hide next button
  isEnd?: boolean; // Mark as final step
  step?: number; // Custom step number for targeting
  onEnter?: () => void; // Callback when step is entered
  onNext?: () => void; // Callback when next is clicked
};
```

## Slots

| Slot           | Props | Description                                 |
| -------------- | ----- | ------------------------------------------- |
| `step-[index]` | -     | Custom content for specific step (optional) |

## Features

### Guided Navigation

- **Step-by-Step**: Sequential tour progression with navigation controls
- **Skip Option**: Allow users to skip the entire tour
- **Previous/Next**: Navigate between steps with arrow buttons
- **End Tour**: Complete the tour and mark as finished

### Element Targeting

- **Data Attributes**: Targets elements using `data-[target]="[step]"` attributes
- **Dynamic Elements**: Waits for elements to appear in DOM
- **Smooth Scrolling**: Automatically scrolls to target elements
- **Mutation Observer**: Handles dynamically loaded content

### Floating Positioning

- **Auto Placement**: Automatically positions tooltip for best visibility
- **Arrow Indicator**: Visual arrow pointing to target element
- **Responsive**: Adapts to screen size and element position
- **Hide Logic**: Hides tooltip when target is not visible

### State Management

- **Local Storage**: Persists tour progress across sessions
- **App-Specific**: Separate storage for different applications
- **Resume Capability**: Continues from last step on page reload
- **Tour Completion**: Tracks completed tours to prevent repetition

## Usage Examples

### Basic Tour

```vue
<script setup>
const tourSteps = [
  {
    title: 'Welcome!',
    text: "Let's take a quick tour of the dashboard.",
    placement: 'bottom'
  },
  {
    title: 'Navigation',
    text: 'Use the sidebar to navigate between sections.',
    placement: 'right'
  },
  {
    title: 'Settings',
    text: 'Configure your preferences here.',
    placement: 'top',
    isEnd: true
  }
];
</script>

<template>
  <div>
    <!-- Tour targets -->
    <div data-dashboard-tour="0" class="bg-blue-100 p-4">Welcome section</div>

    <div data-dashboard-tour="1" class="bg-green-100 p-4">Navigation sidebar</div>

    <div data-dashboard-tour="2" class="bg-yellow-100 p-4">Settings panel</div>

    <!-- Tour component -->
    <AppTour :steps="tourSteps" target="dashboard-tour" />
  </div>
</template>
```

### Tour with Custom Content

```vue
<script setup>
const tourSteps = [
  {
    title: 'Getting Started',
    text: 'Learn how to use our new interface.',
    placement: 'bottom'
  },
  {
    title: 'Advanced Features',
    text: 'Discover powerful tools and options.',
    placement: 'left'
  }
];
</script>

<template>
  <div>
    <div data-feature-tour="0" class="p-4">Getting started area</div>

    <div data-feature-tour="1" class="p-4">Advanced features area</div>

    <AppTour :steps="tourSteps" target="feature-tour">
      <!-- Custom content for step 0 -->
      <template #step-0>
        <div class="mb-2 rounded bg-blue-50 p-2"><strong>💡 Tip:</strong> This is a custom step introduction!</div>
      </template>
    </AppTour>
  </div>
</template>
```

### Tour with Callbacks

```vue
<script setup>
const tourSteps = [
  {
    title: 'Step 1',
    text: 'First step with custom behavior.',
    placement: 'bottom',
    onEnter: () => {
      console.log('Entered step 1');
      // Highlight element or perform actions
    },
    onNext: () => {
      console.log('Moving to next step');
      // Prepare next step or save data
    }
  },
  {
    title: 'Step 2',
    text: 'Second step with custom behavior.',
    placement: 'top',
    onEnter: () => {
      // Show additional UI elements
      document.querySelector('.help-panel')?.classList.add('visible');
    },
    isEnd: true
  }
];
</script>

<template>
  <div>
    <div data-callback-tour="0" class="p-4">Step 1 target</div>

    <div data-callback-tour="1" class="p-4">Step 2 target</div>

    <AppTour :steps="tourSteps" target="callback-tour" />
  </div>
</template>
```

### Conditional Tour Display

```vue
<script setup>
const { tour, hasActiveTour } = useTour();

const tourSteps = [
  {
    title: 'New Feature',
    text: 'Check out our latest addition!',
    placement: 'bottom'
  }
];

// Check if tour should be active
hasActiveTour('new-feature-tour');
</script>

<template>
  <div>
    <div data-new-feature-tour="0" class="p-4">New feature area</div>

    <!-- Only show tour if active -->
    <AppTour v-if="tour.active" :steps="tourSteps" target="new-feature-tour" />
  </div>
</template>
```

### Tour with Custom Navigation

```vue
<script setup>
const tourSteps = [
  {
    title: 'Step 1',
    text: 'First step - no previous button.',
    placement: 'bottom',
    prevButton: false
  },
  {
    title: 'Step 2',
    text: 'Middle step - both buttons.',
    placement: 'top'
  },
  {
    title: 'Step 3',
    text: 'Last step - no next button.',
    placement: 'left',
    nextButton: false,
    isEnd: true
  }
];
</script>

<template>
  <div>
    <div data-custom-nav-tour="0" class="p-4">Step 1</div>
    <div data-custom-nav-tour="1" class="p-4">Step 2</div>
    <div data-custom-nav-tour="2" class="p-4">Step 3</div>

    <AppTour :steps="tourSteps" target="custom-nav-tour" />
  </div>
</template>
```

## Element Targeting

### Data Attribute Format

Target elements using the format: `data-[target]="[step]"`

```html
<!-- For tour with target="my-tour" -->
<div data-my-tour="0">Step 0 target</div>
<div data-my-tour="1">Step 1 target</div>
<div data-my-tour="2">Step 2 target</div>

<!-- Custom step numbers -->
<div data-my-tour="10">Custom step 10</div>
<div data-my-tour="20">Custom step 20</div>
```

## Placement Options

The `placement` prop supports all Floating UI placements:

- `top`, `top-start`, `top-end`
- `bottom`, `bottom-start`, `bottom-end`
- `left`, `left-start`, `left-end`
- `right`, `right-start`, `right-end`

## Technical Details

### Floating UI Integration

- **Auto Update**: Tooltip position updates automatically
- **Middleware**: Offset, shift, auto-placement, hide, and arrow
- **Responsive**: Adapts to viewport changes

### Element Detection

- **Mutation Observer**: Watches for DOM changes
- **Promise-based**: Waits for elements to appear
- **Selector Generation**: Creates data attribute selectors
- **Fallback Handling**: Graceful handling of missing elements

### State Persistence

- **App-Specific Keys**: Uses app name for storage keys
- **Progress Tracking**: Saves current step and target
- **Completion Tracking**: Records finished tours
- **Cleanup**: Removes storage on tour completion

## Dependencies

- **@floating-ui/vue**: For positioning and floating behavior
- **useTour**: Composable for state management
- **useLocalStorage**: For persistence
- **AppIcon**: For navigation icons
