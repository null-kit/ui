<template>
  <component v-if="slots.default" :is="slots.default()[0]" @mouseenter="onMouseEnter" @mouseleave="canPaste = false">
    <template #label-right>
      <div class="-mb-px ml-auto flex gap-1">
        <AppAppear v-if="canPaste">
          <button type="button" class="btn btn-default btn-xs" @click="onPaste">
            <AppIcon name="paste" class="size-3" />
            Paste
          </button>
        </AppAppear>

        <AppAppear v-if="modelValue.length">
          <button type="button" class="btn btn-default btn-xs" @click="onCopy">
            <AppIcon :name="isCopied ? 'square-check' : 'copy'" class="size-3" />
            Copy
          </button>
        </AppAppear>
      </div>
    </template>
  </component>
</template>

<script setup lang="ts">
import { useSlots } from 'vue';

const slots = useSlots();

const props = defineProps<{ name: string }>();

const vnode = computed(() => slots.default?.()[0]);

const modelValue = computed(() => vnode.value?.props?.modelValue);

const canPaste = ref(false);
const isCopied = ref(false);

const onCopy = async () => {
  await navigator.clipboard.writeText(JSON.stringify({ name: props.name, payload: modelValue.value }));

  isCopied.value = true;

  setTimeout(() => (isCopied.value = false), 1000);
};

const onRead = async () => {
  try {
    const text = await navigator.clipboard.readText();
    const data = JSON.parse(text);

    if (data?.name === props.name && 'payload' in data) {
      return data.payload;
    }

    return undefined;
  } catch {
    return undefined;
  }
};

const onMouseEnter = async () => {
  canPaste.value = Boolean(await onRead());
};

const onPaste = async () => {
  vnode.value?.props?.['onUpdate:modelValue']?.(await onRead());
};
</script>
