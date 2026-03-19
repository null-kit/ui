---
title: Tour
description: Guide users through interactive website tours
---

## Usage `useTour`

::note{to="https://floating-ui.com/docs/vue"}
Component is built using `@floating-ui/vue` under the hood.
::

```vue [app.vue]
<template>
  <AppTour v-if="tour.active" :steps target="tour-build-starship" />
</template>

<script setup lang="ts">
const { tour, onTargetClick, hasActiveTour } = useTour();

const steps: TourStep[] = [
  {
    title: 'Welcome to starship build tour',
    text: "Let's get started",
    prevButton: false
  },
  {
    title: 'Go to the store',
    text: 'Click on <b>Store</b> in the navigation menu',
    onNext: () => navigateTo('/store')
  },
  {
    title: 'Get advanced propulsion',
    text: 'Click Buy <b>Advanced Propulsion</b>'
  },
  {
    title: 'Build yuor first hull',
    text: 'Click on <b>Build a strong hull</b>'
  },
  {
    title: 'Congratulations!',
    text: "You've successfully build starship",
    prevButton: false,
    isEnd: true
  }
];

onMounted(hasActiveTour('tour-build-starship'));
</script>
```

```vue [index.vue]
<template>
  <div data-tour-build-starship="0">Homepage</div>

  <button type="button" data-tour-build-starship="1">Store</button>

  <button type="button" data-tour-build-starship="2">Buy Advanced Propulsion</button>

  <button type="button" data-tour-build-starship="3">Build a strong hull</button>

  <div data-tour-build-starship="4">Homepage</div>
</template>
```

## API

### `tour`

<!-- prettier-ignore -->
::field-group
  ::field{name="active" type="boolean"}
  ::
  ::field{name="currentStep" type="number"}
  ::
  ::field{name="target" type="string"}
::

### `setTourStep`

<!-- prettier-ignore -->
::field-group
  ::field{name="step" type="number" required}
  Manually sets the step of the active tour
  ::
  ::field{name="callback" type="function"}
  Function to be executed after the step has changed
  ::
::

### `onTargetClick`

::field{name="step" type="number | string" required}

### `onTourEnd`

::field{type="void"}
Ends the active tour immediately
::

### `onTourRestart`

::field{name="name" type="string" required}
Restart an ended tour
::

### `hasActiveTour`

::field{name="target" type="string" required}
Continues the active tour after refreshing the page
::
