<template>
  <span v-if="inline" :class="['flex', iconClass]" v-html="iconInline" />

  <svg v-else :class="iconClass" fill="none">
    <use :href="`/_sprite.svg#${name}`" />
  </svg>
</template>

<script lang="ts">
const icons = import.meta.glob<string>('@/assets/img/svg/*.svg', {
  query: '?raw',
  import: 'default',
  eager: false
});
</script>

<script setup lang="ts">
const props = defineProps<{ name: string; inline?: boolean }>();

const attrs = useAttrs();

const iconClass = computed(() => ({ 'shrink-0': true, 'size-4': !String(attrs.class).includes('size-') }));

const iconInline = shallowRef();

onMounted(async () => {
  if (props.inline) {
    const iconRaw = Object.entries(icons).find(([path]) => path.endsWith(`/${props.name}.svg`));

    if (!iconRaw) {
      console.error(`Icon '${props.name}' not found`);
      return;
    }

    try {
      const raw = await iconRaw[1]();

      iconInline.value = raw
        .replace(/\n/g, '')
        .replace(/<svg/, '<svg width="100%" height="100%"')
        .replace(/fill="(?!none")[^"]*"/g, 'fill="currentColor"');
    } catch (error) {
      console.error(`Failed to load icon '${props.name}'`, error);
    }
  }
});
</script>
