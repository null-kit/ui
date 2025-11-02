<template>
  <span v-if="inline" :class="['flex', iconClass]" v-html="iconInline" />

  <svg v-else :class="iconClass" fill="none">
    <use :href="`/_sprite.svg#${name}`" />
  </svg>
</template>

<script setup lang="ts">
const props = defineProps<{ name: string; inline?: boolean }>();

const attrs = useAttrs();

const iconClass = computed(() => ({ 'shrink-0': true, 'size-4': !String(attrs.class).includes('size-') }));

const iconInline = shallowRef();

onMounted(async () => {
  if (props.inline) {
    const iconRaw = await import(`~/assets/img/svg/${props.name}.svg?raw`);

    iconInline.value = iconRaw.default
      .replace(/\n/g, '')
      .replace(/<svg/, '<svg width="100%" height="100%" fill="none"')
      .replace(/fill="(?!none")[^"]*"/g, 'fill="currentColor"');
  }
});
</script>
