<template>
  <div class="btn-group bg-darwin">
    <label type="button" class="btn btn-sm cursor-pointer">
      <AppIcon name="editor:image" />
      <input type="file" class="hidden" accept="image/*" @change="onImageUpload" />
    </label>

    <AppDropdown dropdown-class="!rounded-lg" autoclose>
      <template #trigger>
        <button type="button" class="btn btn-sm">
          <AppIcon name="editor:video" />
        </button>
      </template>

      <FormEditorYoutube :editor />
    </AppDropdown>

    <button
      type="button"
      class="btn btn-sm"
      @click="editor.commands.insertTable({ rows: 3, cols: 3, withHeaderRow: false })"
    >
      <AppIcon name="editor:table" />
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3';

const { editor, path = 'editor' } = defineProps<{ editor: Editor; path?: string }>();

const onImageUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;

  const file = target.files?.[0];

  if (file) {
    const body = new FormData();

    body.append('image', file);

    const response = await $fetch(`/api/storage/${path}`, { method: 'POST', body });

    if (response[0]) editor.commands.setImage({ src: response[0].url });
  }
};
</script>
