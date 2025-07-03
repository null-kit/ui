<template>
  <div>
    <div class="ring-edison bg-darwin flex gap-1 rounded-xl p-1.5 shadow ring select-none" :class="tabsClass">
      <button
        v-for="(tab, index) in tabs"
        :key="index"
        :class="['flex-1 overflow-clip rounded-lg', tabClass, isActive(tab) && activeClass]"
        type="button"
        @click="toggleTab(tab)"
      >
        <slot :name="`tab-${normalizeTab(tab)}`" :is-active="isActive(tab)">
          <span :class="tabInnerClass">
            {{ tab }}
          </span>
        </slot>
      </button>
    </div>

    <slot :name="selectedTab" />
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
    noQuery?: boolean;
  }>(),
  {
    tabsClass: 'w-fit mb-4',
    tabClass: 'btn w-full',
    tabInnerClass: undefined,
    activeClass: 'btn-default text-accent',
    noQuery: false
  }
);

const route = useRoute();

const normalizeTab = (tab: string) => tab.trim().toLowerCase().replace(/[.\s]/g, '-');

const activeTab = ref();

const selectedTab = computed(() => normalizeTab(String(activeTab.value || route.query.tab || props.tabs[0])));

const isActive = (tab: string) => normalizeTab(tab) === selectedTab.value;

const toggleTab = (tab: string) => {
  const formattedTab = normalizeTab(tab);

  activeTab.value = formattedTab;

  if (!props.noQuery) navigateTo({ query: { ...route.query, tab: formattedTab, page: undefined } });
};

onMounted(() => {
  if (!props.tabs.map(normalizeTab).includes(selectedTab.value)) {
    navigateTo({ query: { ...route.query, tab: undefined } });
  }
});
</script>
