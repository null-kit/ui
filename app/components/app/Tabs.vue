<template>
  <div>
    <div class="flex gap-2 select-none" :class="tabsClass">
      <button
        v-for="(tab, index) in tabs"
        :key="index"
        :class="['flex-1 overflow-clip', tabClass, isActive(tab) && activeClass]"
        type="button"
        @click="toggleTab(tab)"
      >
        <slot :name="`tab-${formatTab(tab)}`" :is-active="isActive(tab)">
          <span :class="tabInnerClass">
            {{ tab }}
          </span>
        </slot>
      </button>
    </div>

    <slot :name="activeTab" />
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    tabs: string[];
    tabsClass?: string;
    tabClass?: string;
    tabInnerClass?: string;
    activeClass?: string;
    defaultTab?: string;
    noQuery?: boolean;
  }>(),
  {
    tabsClass: 'w-fit rounded-xl shadow ring-edison bg-darwin ring mb-4 p-2',
    tabClass: 'btn w-full',
    tabInnerClass: undefined,
    activeClass: 'btn-default text-accent',
    noQuery: false,
    defaultTab: undefined
  }
);

const route = useRoute();

const formatTab = (tab: string) => tab.trim().toLowerCase().replace(/[.\s]/g, '-');

const defaultTab = computed(() => formatTab(String(props.defaultTab ?? props.tabs[0])));

const activeTab = ref((route.query.tab as string) ?? defaultTab.value);

const isActive = (tab: string) => formatTab(tab) === activeTab.value;

const toggleTab = (tab: string) => {
  const formattedTab = formatTab(tab);

  activeTab.value = formattedTab;

  if (!props.noQuery) {
    navigateTo({
      query: {
        ...route.query,
        tab: defaultTab.value === formattedTab ? undefined : formattedTab,
        page: undefined
      }
    });
  }
};

onMounted(() => {
  if (!props.tabs.map(formatTab).includes(activeTab.value)) {
    navigateTo({ query: { ...route.query, tab: undefined } });
  }
});
</script>
