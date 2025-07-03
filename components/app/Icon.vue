<template>
  <span v-if="icon" :class="['block shrink-0', iconSize]" v-html="icon" />
</template>

<script setup lang="ts">
const props = defineProps<{ name: string }>();

const icon = ref('');
const iconCache = new Map();

const iconSize = computed(() => ({ 'size-4': !String(useAttrs().class).includes('size-') }));

const iconLoad = async () => {
  if (iconCache.has(props.name)) {
    icon.value = iconCache.get(props.name);
    return;
  }

  try {
    const iconImport = await import(`@/assets/img/svg/${props.name}.svg?raw`);

    const content = iconImport.default
      .replace(/\n/g, '')
      .replace(/<svg/, '<svg width="100%" height="100%"')
      .replace(/fill="(?!none")[^"]*"/g, 'fill="currentColor"');

    iconCache.set(props.name, content);
    icon.value = content;
  } catch {
    console.error(`Icon '${props.name}' doesn't exist`);
    icon.value = '';
  }
};

watch(() => props.name, iconLoad, { immediate: true });
</script>
