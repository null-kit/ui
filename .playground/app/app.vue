<template>
  <div class="container mx-auto grid grid-cols-[15rem_1fr] gap-4">
    <Title>Nuxt UI Layer - Null-Kit</Title>

    <aside class="border-edison sticky top-0 flex h-dvh flex-col border-r p-4">
      <nav class="flex flex-col *:justify-start">
        <NuxtLink to="/#utils" class="btn">Utils</NuxtLink>
        <NuxtLink to="/#clipboard" class="btn">Clipboard</NuxtLink>
        <NuxtLink to="/#confirm" class="btn">Confirm</NuxtLink>
        <NuxtLink to="/#toasts" class="btn">Toasts</NuxtLink>
        <NuxtLink to="/#charts" class="btn">Charts</NuxtLink>
        <NuxtLink to="/#datepicker" class="btn">Datepicker</NuxtLink>
        <NuxtLink to="/#table" class="btn">Table</NuxtLink>
        <NuxtLink to="/#tabs" class="btn">Tabs</NuxtLink>
        <NuxtLink to="/#icon" class="btn">Icon</NuxtLink>
        <NuxtLink to="/#drawer" class="btn">Drawer & Modal</NuxtLink>
        <NuxtLink to="/#tooltip" class="btn">Tooltip</NuxtLink>
        <NuxtLink to="/#pagination" class="btn">Pagination</NuxtLink>
        <NuxtLink to="/#badge" class="btn">Badge</NuxtLink>
        <NuxtLink to="/#select" class="btn">Select</NuxtLink>
        <NuxtLink to="/#control" class="btn">Control</NuxtLink>
        <NuxtLink to="/#tree-select" class="btn">Tree Select</NuxtLink>
        <NuxtLink to="/#checkbox" class="btn">Checkbox</NuxtLink>
        <NuxtLink to="/#dropdown" class="btn">Dropdown</NuxtLink>
        <NuxtLink to="/#editor" class="btn">Editor</NuxtLink>
      </nav>

      <button type="button" class="btn btn-default mt-auto" @click="$theme.toggleTheme">Toggle Theme</button>
    </aside>

    <main class="min-w-0 space-y-8 p-4">
      <DemoTable />

      <DemoButton />

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

        <div class="flex gap-4">
          <button
            type="button"
            class="btn btn-default"
            @click="
              useConfirm({
                message: 'Are you sure you want to delete this user?',
                onConfirm: async () => setToast({ title: 'Success!', text: 'User deleted successfully!' })
              })
            "
          >
            Delete User
          </button>

          <AppConfirm message="Are you sure you want to receive a load of money?">
            <button type="button" class="btn btn-default">Load Money</button>
          </AppConfirm>

          <AppConfirm
            message="This action cannot be undone"
            title="Delete John Wick"
            confirm-text="Delete"
            confirm-class="btn-danger"
            @confirm="setToast({ title: 'Success!', text: 'John Wick deleted successfully!', type: 'success' })"
          >
            <button type="button" class="btn btn-default">Delete John Wick</button>
          </AppConfirm>
        </div>
      </fieldset>

      <fieldset id="toasts">
        <legend>Toasts</legend>

        <div class="flex gap-4">
          <button
            type="button"
            class="btn btn-default"
            @click="setToast({ title: 'Nice!', text: 'This is a default toast!' })"
          >
            Default Toast
          </button>

          <button
            type="button"
            class="btn btn-default"
            @click="setToast({ title: 'Success!', text: 'Your operation was successful!', type: 'success' })"
          >
            Success Toast
          </button>

          <button
            type="button"
            class="btn btn-default"
            @click="setToast({ title: 'Error!', text: 'Your operation was failed!', type: 'error' })"
          >
            Error Toast
          </button>

          <button
            type="button"
            class="btn btn-default"
            @click="setToast({ title: 'Info!', text: 'Your operation was okay!', type: 'info' })"
          >
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

      <DemoDatepicker />

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

      <DemoIcon />

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

      <DemoSelect />

      <DemoControl />

      <fieldset id="tree-select">
        <legend>Tree Select</legend>

        <FormTreeSelect name="treeSelect" :options="formData.treeSelect" search />
      </fieldset>

      <DemoCheckbox />

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
const { setToast } = useToast();
const { copy, statusText } = useClipboard();

const formData = reactive({
  color: 'blue',
  status: false,
  darkMode: true,
  fruits: ['apple', 'grape'],
  pet: ['Bird'],
  size: 'medium',
  drawerOpen: false,
  modalOpen: false,
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
    date: `2024-01-${index + 4}`,
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
  ],
  tableBig: [
    {
      id: 1,
      name: 'John',
      email: 'john@example.com',
      size: 'small',
      status: 'active',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      createdAt: formatDate(new Date())
    },
    {
      id: 2,
      name: 'Jane',
      email: 'jane@example.com',
      size: 'medium',
      status: 'inactive',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      createdAt: formatDate(new Date())
    },
    {
      id: 3,
      name: 'Jim',
      email: 'jim@example.com',
      size: 'large',
      status: 'active',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      createdAt: formatDate(new Date())
    }
  ]
});

const route = useRoute();

onMounted(() => {
  document.documentElement.style.scrollPaddingTop = '20px';

  if (route.hash) {
    const element = document.getElementById(route.hash.slice(1));
    if (element) element.scrollIntoView();
  }

  const handleAnchorClick = (event: Event) => {
    const target = event.target as HTMLElement;

    if (target.getAttribute('href')?.includes('#')) {
      event.preventDefault();

      const anchor = target.getAttribute('href')?.split('#')[1];

      if (anchor) {
        const element = document.getElementById(anchor);

        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  document.addEventListener('click', handleAnchorClick);
});
</script>

<style>
fieldset {
  border-radius: var(--radius-2xl);
  padding: calc(var(--spacing) * 4);
  padding-top: calc(var(--spacing) * 3);
  border: 1px solid var(--color-edison);
  box-shadow: var(--shadow-xs);

  fieldset {
    border-radius: var(--radius-lg);
  }
}

legend {
  font-size: var(--text-sm);
  padding-inline: calc(var(--spacing) * 1);
  background-color: var(--color-darwin);
}
</style>
