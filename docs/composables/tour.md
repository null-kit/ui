# tour Composable

A composable for managing guided tour state, persistence, and navigation. Provides tour lifecycle management, local storage integration, and app-specific tour tracking.

## Function Signature

```typescript
useTour(): {
  tour: Ref<TourState>;
  setTourStep: (step: number, callback?: () => void) => void;
  onTargetClick: (step: string) => void;
  onTourEnd: () => void;
  onTourRestart: (name: string) => void;
  hasActiveTour: (target: string) => void;
}
```

## TourState Type

```typescript
type TourState = {
  active: boolean; // Whether a tour is currently active
  currentStep: number; // Current step index (0-based)
  target: string; // Current tour target identifier
};
```

## Return Values

| Property        | Type                                    | Description                                  |
| --------------- | --------------------------------------- | -------------------------------------------- |
| `tour`          | `Ref<TourState>`                        | Reactive tour state object                   |
| `setTourStep`   | `(step: number, callback?: () => void)` | Set current tour step with optional callback |
| `onTargetClick` | `(step: string)`                        | Programmatically click a tour target element |
| `onTourEnd`     | `() => void`                            | End the current tour and mark as completed   |
| `onTourRestart` | `(name: string)`                        | Restart a completed tour                     |
| `hasActiveTour` | `(target: string)`                      | Check if a tour should be active             |

## Features

### State Management

- **Reactive State**: Tour state is reactive and shared across components
- **Step Tracking**: Current step is persisted and can be resumed
- **Target Tracking**: Current tour target is stored for continuity
- **Active Status**: Boolean flag indicates if tour is currently running

### Local Storage Integration

- **App-Specific Keys**: Storage keys are prefixed with app name
- **Progress Persistence**: Tour progress survives page reloads
- **Completion Tracking**: Completed tours are recorded to prevent repetition
- **Clean Storage**: Automatically cleans up storage when tours end

### Tour Lifecycle

- **Start**: Initialize tour with target and step
- **Progress**: Navigate between steps with state updates
- **End**: Complete tour and mark as finished
- **Restart**: Reset completed tours for re-execution

### Element Interaction

- **Programmatic Clicks**: Trigger clicks on tour target elements
- **Data Attribute Targeting**: Uses `data-[target]="[step]"` format
- **Dynamic Elements**: Works with elements that appear after tour starts

## Usage Examples

### Basic Tour Management

```vue
<script setup>
const { tour, setTourStep, onTourEnd } = useTour();

// Start a tour
const startTour = () => {
  tour.value.active = true;
  tour.value.target = 'dashboard-tour';
  tour.value.currentStep = 0;
  setTourStep(0);
};

// Navigate to specific step
const goToStep = (step: number) => {
  setTourStep(step, () => {
    console.log(`Moved to step ${step}`);
  });
};

// End tour
const endTour = () => {
  onTourEnd();
};
</script>

<template>
  <div>
    <button @click="startTour">Start Tour</button>
    <button @click="goToStep(2)">Go to Step 3</button>
    <button @click="endTour">End Tour</button>

    <div v-if="tour.active">Current step: {{ tour.currentStep }}</div>
  </div>
</template>
```

### Conditional Tour Display

```vue
<script setup>
const { tour, hasActiveTour } = useTour();

const tourSteps = [
  { title: 'Welcome', text: 'Welcome to our app!' },
  { title: 'Features', text: 'Discover our features.' }
];

// Check if tour should be active for this target
hasActiveTour('welcome-tour');
</script>

<template>
  <div>
    <!-- Tour targets -->
    <div data-welcome-tour="0">Welcome area</div>
    <div data-welcome-tour="1">Features area</div>

    <!-- Only show tour if it should be active -->
    <AppTour v-if="tour.active" :steps="tourSteps" target="welcome-tour" />
  </div>
</template>
```

### Tour with Custom Navigation

```vue
<script setup>
const { tour, setTourStep, onTargetClick } = useTour();

const tourSteps = [
  { title: 'Step 1', text: 'First step' },
  { title: 'Step 2', text: 'Second step' },
  { title: 'Step 3', text: 'Third step' }
];
</script>

<template>
  <div>
    <div data-custom-tour="0">Step 1 target</div>
    <div data-custom-tour="1">Step 2 target</div>
    <div data-custom-tour="2">Step 3 target</div>

    <!-- Custom navigation -->
    <div class="tour-controls">
      <button @click="setTourStep(tour.value.currentStep - 1)">Previous</button>

      <span>Step {{ tour.currentStep + 1 }} of {{ tourSteps.length }}</span>

      <button @click="setTourStep(tour.value.currentStep + 1)">Next</button>
    </div>

    <AppTour :steps="tourSteps" target="custom-tour" />
  </div>
</template>
```

### Tour Restart Functionality

```vue
<script setup>
const { tour, onTourRestart } = useTour();

const restartTour = () => {
  // Restart the specific tour
  onTourRestart('dashboard-tour');
  // This will reload the page and reset the tour
};

const showRestartButton = computed(() => {
  // Show restart button if tour was completed
  return !tour.value.active;
});
</script>

<template>
  <div>
    <div data-dashboard-tour="0">Dashboard area</div>
    <div data-dashboard-tour="1">Settings area</div>

    <!-- Restart button for completed tours -->
    <button v-if="showRestartButton" @click="restartTour" class="btn btn-secondary">Restart Tour</button>

    <AppTour v-if="tour.active" :steps="tourSteps" target="dashboard-tour" />
  </div>
</template>
```

## Storage Keys

The composable uses app-specific storage keys:

### Active Tour Key

```
[app-name]-active-tour
```

Stores the current tour state:

```json
{
  "currentStep": 2,
  "target": "dashboard-tour"
}
```

### Completed Tours Key

```
[app-name]-ended-tours
```

Stores array of completed tour targets:

```json
["welcome-tour", "features-tour"]
```

### App Name Normalization

The app name is normalized for storage:

- Converted to lowercase
- Special characters replaced with hyphens
- Example: "My App v2.0" → "my-app-v2-0"

## State Flow

### Tour Start

1. Set `tour.active = true`
2. Set `tour.target` to tour identifier
3. Set `tour.currentStep` to starting step
4. Call `setTourStep()` to persist state

### Tour Progress

1. Update `tour.currentStep` as user navigates
2. Call `setTourStep()` to persist changes
3. Optional callback executed after state update

### Tour End

1. Call `onTourEnd()` to complete tour
2. Tour target added to completed tours list
3. Active tour storage cleared
4. `tour.active` set to false

### Tour Restart

1. Call `onTourRestart()` with tour name
2. Tour removed from completed tours list
3. Active tour storage cleared
4. Page reloaded to reset state

## Technical Details

### State Persistence

- **useState**: Shared reactive state across components
- **useLocalStorage**: Persistent storage with app-specific keys
- **Automatic Sync**: State changes automatically persist to storage
- **Cleanup**: Storage cleaned up when tours end

### Element Targeting

- **Data Attributes**: Uses `data-[target]="[step]"` format
- **Query Selector**: Finds elements using generated selectors
- **Click Simulation**: Programmatically triggers click events
- **Error Handling**: Graceful handling of missing elements

### App Configuration

- **Runtime Config**: Reads app name from Nuxt runtime config
- **Fallback Handling**: Returns early if app config is missing
- **Key Generation**: Creates unique storage keys per application

## Dependencies

- **useRuntimeConfig**: For app configuration
- **useLocalStorage**: For persistent storage
- **useState**: For shared reactive state
