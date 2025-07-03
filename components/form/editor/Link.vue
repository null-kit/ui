<template>
  <div class="flex items-center p-1">
    <input
      v-model="link"
      type="url"
      class="min-h-7 appearance-none px-2 text-sm outline-none"
      placeholder="Enter link"
    />

    <button
      v-if="link && editor.isActive('link') && link === editor.getAttributes('link').href"
      type="button"
      class="btn btn-default btn-sm"
      @click="editor.chain().focus().unsetLink().run()"
    >
      <AppIcon name="editor:unlink" />
    </button>

    <button v-else type="button" class="btn btn-default btn-sm" @click="onSubmit">
      <AppIcon name="editor:check" />
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3';

const { editor } = defineProps<{ editor: Editor }>();

const link = ref('');

const onSubmit = () => {
  if (!link.value) return editor.chain().focus().extendMarkRange('link').unsetLink().run();

  editor.chain().focus().extendMarkRange('link').setLink({ href: link.value }).run();
};

watchEffect(() => {
  if (editor) link.value = editor.getAttributes('link').href || '';
});
</script>
