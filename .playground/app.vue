<template>
  <div class="container mx-auto grid grid-cols-[15rem_1fr] gap-4">
    <title>Nuxt UI Layer - Null-Kit</title>

    <aside class="border-edison sticky top-0 flex h-dvh flex-col border-r p-4">
      <nav class="flex flex-col *:justify-start">
        <a href="#utils" class="btn">Utils</a>
        <a href="#clipboard" class="btn">Clipboard</a>
        <a href="#confirm" class="btn">Confirm</a>
        <a href="#toasts" class="btn">Toasts</a>
        <a href="#charts" class="btn">Charts</a>
        <a href="#datepicker" class="btn">Datepicker</a>
        <a href="#table" class="btn">Table</a>
        <a href="#tabs" class="btn">Tabs</a>
        <a href="#icon" class="btn">Icon</a>
        <a href="#drawer" class="btn">Drawer & Modal</a>
        <a href="#tooltip" class="btn">Tooltip</a>
        <a href="#pagination" class="btn">Pagination</a>
        <a href="#badge" class="btn">Badge</a>
        <a href="#select" class="btn">Select</a>
        <a href="#control" class="btn">Control</a>
        <a href="#tree-select" class="btn">Tree Select</a>
        <a href="#checkbox" class="btn">Checkbox</a>
        <a href="#dropdown" class="btn">Dropdown</a>
        <a href="#editor" class="btn">Editor</a>
      </nav>

      <button type="button" class="btn btn-default mt-auto" @click="$theme.toggleTheme">Toggle Theme</button>
    </aside>

    <main class="space-y-8 p-4">
      <fieldset id="utils">
        <legend>Utils</legend>

        <div class="flex gap-10">
          <div>
            <div class="text-sm opacity-30">formatDate:</div>
            <div>{{ formatDate(new Date(), { year: true }) }}</div>
          </div>

          <div>
            <div class="text-sm opacity-30">formatNumber:</div>
            <div>{{ formatNumber(1234567890) }}</div>
          </div>

          <div>
            <div class="text-sm opacity-30">formatNumber (Currency):</div>
            <div>{{ formatNumber(345567, { currency: 'USD' }) }}</div>
          </div>
        </div>
      </fieldset>

      <fieldset id="clipboard">
        <legend>Clipboard</legend>

        <div class="flex gap-4">
          <AppTooltip :message="statusText">
            <button type="button" class="btn btn-default" @click="copy('This is copied text!')">Copy</button>
          </AppTooltip>

          <FormControl placeholder="Paste here" />
        </div>
      </fieldset>

      <fieldset id="confirm">
        <legend>Confirm</legend>

        <button
          type="button"
          class="btn btn-default"
          @click="
            useConfirm({
              message: 'Are you sure you want to delete this user?',
              onConfirm: async () => setToast('Success!', 'User deleted successfully!')
            })
          "
        >
          Delete User
        </button>
      </fieldset>

      <fieldset id="toasts">
        <legend>Toasts</legend>

        <div class="flex gap-4">
          <button type="button" class="btn btn-default" @click="setToast('Nice!', 'This is a default toast!')">
            Default Toast
          </button>

          <button
            type="button"
            class="btn btn-default"
            @click="setToast('Success!', 'Your operation was successful!', 'success')"
          >
            Success Toast
          </button>

          <button
            type="button"
            class="btn btn-default"
            @click="setToast('Error!', 'Your operation was failed!', 'error')"
          >
            Error Toast
          </button>

          <button type="button" class="btn btn-default" @click="setToast('Info!', 'Your operation was okay!', 'info')">
            Info Toast
          </button>
        </div>
      </fieldset>

      <fieldset id="charts">
        <legend>Charts</legend>

        <div class="grid gap-10 md:grid-cols-[20rem_1fr]">
          <AppChartDonut :data="formData.donutChart" category-key="format" value-key="value" />

          <AppChartArea :data="formData.areaChart" :categories="['impressions', 'requests', 'margin']" x-key="date" />
        </div>
      </fieldset>

      <fieldset id="datepicker">
        <legend>Datepicker</legend>

        <div class="flex gap-4">
          <AppDatepicker v-model="formData.signleDate" />

          <AppDatepicker v-model="formData.rangeDates" range />

          <AppDatepicker v-model="formData.signleDate" date-mode="short" />
        </div>
      </fieldset>

      <fieldset id="table">
        <legend>Table</legend>

        <AppTable :columns="formData.table" sticky-head />
      </fieldset>

      <fieldset id="tabs">
        <legend>Tabs</legend>

        <AppTabs :tabs="['Tab 1', 'Tab 2', 'Tab 3']">
          <template #tab-1>
            <div>Tab Content 1</div>
          </template>

          <template #tab-2>
            <div>Tab Content 2</div>
          </template>

          <template #tab-3>
            <div>Tab Content 3</div>
          </template>
        </AppTabs>
      </fieldset>

      <fieldset id="icon">
        <legend>Icon</legend>

        <div class="flex gap-4">
          <AppIcon name="editor:bold" />
          <AppIcon name="editor:italic" />
          <AppIcon name="editor:underline" />
        </div>
      </fieldset>

      <fieldset id="drawer">
        <legend>Drawer & Modal</legend>

        <div class="flex gap-4">
          <button type="button" class="btn btn-default" @click="formData.drawerOpen = true">Open drawer</button>

          <button type="button" class="btn btn-default" @click="formData.modalOpen = true">Open modal</button>
        </div>

        <AppDrawer v-if="formData.drawerOpen" @close="formData.drawerOpen = false">
          <div class="p-2">Click anywhere to close</div>
        </AppDrawer>

        <AppModal v-if="formData.modalOpen" @close="formData.modalOpen = false">
          <template #title>Modal Title</template>

          <div class="px-4 pb-4">Click on the times icon to close</div>
        </AppModal>
      </fieldset>

      <fieldset id="tooltip">
        <legend>Tooltip</legend>

        <div class="flex items-center gap-4">
          <AppTooltip message="Floating Message" trigger="Default Tooltip" />

          <AppTooltip>
            <template #message>
              <div class="p-2">
                <div class="mb-1 font-bold text-blue-300">Custom Message</div>
                <div>This is a custom message</div>
              </div>
            </template>

            Custom Tooltip
          </AppTooltip>
        </div>
      </fieldset>

      <fieldset id="pagination">
        <legend>Pagination</legend>

        <AppPagination :total-pages="50" />
      </fieldset>

      <fieldset id="badge">
        <legend>Badge</legend>

        <div class="flex gap-2">
          <AppBadge label="Default" />
          <AppBadge type="danger" label="Danger" />
          <AppBadge type="warning" label="Warning" />
          <AppBadge type="success" label="Success" />
          <AppBadge type="info" label="Info" />
        </div>
      </fieldset>

      <fieldset id="select">
        <legend>Form Select</legend>

        <div class="flex gap-4">
          <FormSelect
            v-model="formData.country"
            label="Default Select"
            name="country"
            placeholder="Select a country"
            :options="['United States', 'Canada', 'United Kingdom']"
          />

          <FormSelect
            v-model="formData.country"
            label="Multiple Select"
            name="country"
            placeholder="Select countries"
            :options="['United States', 'Canada', 'United Kingdom']"
            multiple
            search
            order
          />
        </div>
      </fieldset>

      <fieldset id="control">
        <legend>Form Control</legend>

        <div class="grid grid-cols-3 gap-4">
          <FormControl label="Text Input" name="username" placeholder="Enter your username" required />

          <FormControl type="number" label="Number Input" name="age" placeholder="Enter your age" step="1" />

          <FormControl
            v-model="formData.country"
            type="select"
            label="Select"
            name="country"
            placeholder="Select a country"
          >
            <option value="United States">United States</option>
            <option value="Canada">Canada</option>
            <option value="United Kingdom">United Kingdom</option>
          </FormControl>

          <FormControl type="email" label="Email with Left Slot" name="email" placeholder="Enter your email">
            <template #left>
              <div class="p-2.5">Left Slot</div>
            </template>
          </FormControl>

          <FormControl
            type="password"
            label="Password with Slot and Custom Help"
            name="password"
            placeholder="Enter your password"
          >
            <template #right>
              <svg class="m-3 size-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm9-.45S19.75 20 12.02 20C4.84 20 0 11.55 0 11.55S4.45 4 12.02 4C19.7 4 24 11.55 24 11.55zM17 12a5 5 0 1 0-10.01.01A5 5 0 0 0 17 12z"
                />
              </svg>
            </template>

            <template #help>
              <div class="text-blue-700">
                <p>Password must be at least 8 characters long</p>
                <p>Password must contain at least one special character</p>
              </div>
            </template>
          </FormControl>

          <FormControl
            type="textarea"
            label="Textarea"
            name="description"
            placeholder="Enter description..."
            help="Maximum 500 characters"
          />
        </div>

        <div class="flex gap-4">
          <button
            type="button"
            class="btn btn-default"
            @click="setErrors({ username: 'Username is required', email: 'Please enter a valid email address' })"
          >
            Validate
          </button>

          <button type="button" class="btn btn-default" @click="clearErrors">Clear Errors</button>
        </div>
      </fieldset>

      <fieldset id="tree-select">
        <legend>Tree Select</legend>

        <FormTreeSelect name="treeSelect" :options="formData.treeSelect" search />
      </fieldset>

      <fieldset id="checkbox">
        <legend>Form Checkbox</legend>

        <div class="mb-5 flex items-center gap-10">
          <FormCheck label="Agree to terms and conditions" name="checkbox" />

          <div class="flex gap-4">
            <FormCheck v-model="formData.color" type="radio" label="Red" name="color" value="red" />
            <FormCheck v-model="formData.color" type="radio" label="Blue" name="color" value="blue" />
            <FormCheck v-model="formData.color" type="radio" label="Green" name="color" value="green" />
          </div>

          <FormCheck v-model="formData.status" label="Status" name="status" is-switch />
        </div>

        <div class="flex items-center gap-10">
          <FormCheckGroup
            v-model="formData.color"
            :options="['Red', 'Blue', 'Green']"
            type="radio"
            label="Checkbox Group"
            name="color"
          />

          <FormCheckGroup
            :options="['Dog', 'Cat', 'Bird']"
            v-model="formData.pet"
            type="checkbox"
            label="Radio Group"
            name="pet"
          />
        </div>
      </fieldset>

      <fieldset id="dropdown">
        <legend>Dropdown</legend>

        <div class="flex gap-4">
          <AppDropdown>
            <template #trigger>
              <button type="button" class="btn btn-default">Default Dropdown</button>
            </template>

            <div class="p-2">Click anywhere to close</div>
          </AppDropdown>

          <AppDropdown autoclose>
            <template #trigger>
              <button type="button" class="btn btn-default">Autoclose Dropdown</button>
            </template>

            <div class="p-2">Move cursor to close</div>
          </AppDropdown>
        </div>
      </fieldset>

      <fieldset id="editor">
        <legend>Editor</legend>

        <FormEditor name="body" />
      </fieldset>
    </main>
  </div>
</template>

<script setup lang="ts">
const { setErrors, clearErrors } = useValidate();
const { setToast } = useToast();
const { copy, statusText } = useClipboard();

const formData = reactive({
  country: '',
  color: '',
  status: false,
  pet: '',
  drawerOpen: false,
  modalOpen: false,
  signleDate: new Date(),
  rangeDates: [new Date().setDate(new Date().getDate() - 7), new Date()] as Date[],
  treeSelect: [
    {
      name: 'Electronics',
      value: 'electronics',
      children: [
        { name: 'Phones', value: 'phones' },
        { name: 'Computers', value: 'computers' }
      ]
    },
    {
      name: 'Clothing',
      value: 'clothing',
      children: [
        { name: 'Men', value: 'men' },
        { name: 'Women', value: 'women' }
      ]
    }
  ],
  areaChart: Array.from({ length: 10 }, (_, index) => ({
    date: formatDate(`2024-01-${index + 4}`),
    impressions: Math.floor(Math.random() * 300),
    requests: Math.floor(Math.random() * 150),
    margin: Math.floor(Math.random() * 150)
  })),
  donutChart: [
    { format: 'Desktop', value: Math.floor(Math.random() * 300) },
    { format: 'Mobile', value: Math.floor(Math.random() * 150) },
    { format: 'Tablet', value: Math.floor(Math.random() * 200) }
  ],
  table: [
    { id: 1, name: 'John', email: 'john@example.com' },
    { id: 2, name: 'Jane', email: 'jane@example.com' },
    { id: 3, name: 'Jim', email: 'jim@example.com' }
  ]
});
</script>

<style scoped>
fieldset {
  border-radius: var(--radius-xl);
  padding: calc(var(--spacing) * 4);
  border: 1px solid var(--color-edison);
}

legend {
  font-size: 0.875rem;
  padding-inline: 0.5rem;
  background-color: var(--color-darwin);
}
</style>
