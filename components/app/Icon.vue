<template>
  <span v-if="icon" :class="['block shrink-0', iconSize]" v-html="icon" />
</template>

<script lang="ts">
const icons = import.meta.glob<string>('@/assets/img/svg/*.svg', {
  query: '?raw',
  import: 'default',
  eager: false
});
</script>

<script setup lang="ts">
const props = defineProps<{ name: string }>();
const icon = ref('');

const attrs = useAttrs();

const iconSize = computed(() => ({ 'size-4': !String(attrs.class).includes('size-') }));

const iconLoad = async () => {
  const match = Object.entries(icons).find(([path]) => path.endsWith(`/${props.name}.svg`));

  if (!match) {
    console.error(`Icon '${props.name}' not found`);
    icon.value = '';
    return;
  }

  try {
    const raw = await match[1]();

    icon.value = raw
      .replace(/\n/g, '')
      .replace(/<svg/, '<svg width="100%" height="100%"')
      .replace(/fill="(?!none")[^"]*"/g, 'fill="currentColor"');
  } catch (error) {
    console.error(`Failed to load icon '${props.name}'`, error);
    icon.value = '';
  }
};

watch(() => props.name, iconLoad, { immediate: true });
</script>
