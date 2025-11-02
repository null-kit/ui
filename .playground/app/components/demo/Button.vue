<template>
  <fieldset id="button">
    <legend>Button</legend>

    <div class="space-y-2">
      <fieldset>
        <legend>Variants</legend>

        <div class="flex gap-2">
          <button class="btn">Clear</button>
          <button class="btn btn-default">Default</button>
          <button class="btn btn-main">Main</button>
          <button class="btn btn-accent">Accent</button>
          <button class="btn btn-danger">Danger</button>
        </div>
      </fieldset>

      <fieldset>
        <legend>Disabled</legend>

        <div class="flex gap-2">
          <button class="btn" disabled>Clear</button>
          <button class="btn btn-default" disabled>Default</button>
          <button class="btn btn-main" disabled>Main</button>
          <button class="btn btn-accent" disabled>Accent</button>
          <button class="btn btn-danger" disabled>Danger</button>
        </div>
      </fieldset>

      <fieldset>
        <legend>Pending</legend>

        <div class="flex gap-2">
          <button class="btn btn-pending" disabled>Clear</button>
          <button class="btn btn-default btn-pending" disabled>Default</button>
          <button class="btn btn-main btn-pending" disabled>Main</button>
          <button class="btn btn-accent btn-pending" disabled>Accent</button>
          <button class="btn btn-danger btn-pending" disabled>Danger</button>
        </div>
      </fieldset>

      <fieldset>
        <legend>Sizes</legend>

        <div class="flex flex-wrap items-center gap-2">
          <button class="btn btn-default btn-sm">Small</button>
          <button class="btn btn-default">Default</button>
          <button class="btn btn-default btn-md">Medium</button>
          <button class="btn btn-default btn-lg">Large</button>
        </div>
      </fieldset>

      <fieldset>
        <legend>Group</legend>

        <div class="flex flex-wrap items-center gap-2">
          <div class="btn-group">
            <button class="btn btn-sm">Default</button>
            <button class="btn btn-sm">Default</button>
            <button class="btn btn-sm">Default</button>
          </div>

          <div class="btn-group">
            <button class="btn btn-main">Main</button>
            <button class="btn btn-accent">Accent</button>
            <button class="btn btn-danger">Danger</button>
          </div>

          <div class="btn-group">
            <button class="btn btn-lg">Default</button>
            <button class="btn btn-lg">Default</button>
            <button class="btn btn-lg">Default</button>
          </div>
        </div>
      </fieldset>
    </div>
  </fieldset>
</template>
