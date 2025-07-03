<template>
  <div class="border-edison bg-darwin sticky top-0 z-1 flex justify-center gap-3 rounded-t-lg border-b p-2">
    <div class="btn-group rounded-md">
      <button
        v-for="level in [2, 3, 4] as Level[]"
        :key="level"
        type="button"
        class="btn btn-sm"
        :class="isActive('heading', { level })"
        @click="runCommand((chain) => chain.toggleHeading({ level }))"
      >
        <AppIcon :name="`editor:h${level}`" />
      </button>
    </div>

    <div class="btn-group rounded-md">
      <button
        type="button"
        class="btn btn-sm"
        :class="isActive('bold')"
        @click="runCommand((chain) => chain.toggleBold())"
      >
        <AppIcon name="editor:bold" />
      </button>

      <button
        type="button"
        class="btn btn-sm"
        :class="isActive('italic')"
        @click="runCommand((chain) => chain.toggleItalic())"
      >
        <AppIcon name="editor:italic" />
      </button>

      <button
        type="button"
        class="btn btn-sm"
        :class="isActive('underline')"
        @click="runCommand((chain) => chain.toggleUnderline())"
      >
        <AppIcon name="editor:underline" />
      </button>

      <button type="button" class="btn btn-sm" @click="runCommand((chain) => chain.unsetAllMarks())">
        <AppIcon name="editor:clear-format" />
      </button>
    </div>

    <AppDropdown>
      <template #trigger>
        <button type="button" class="btn btn-default btn-sm" :class="isActive('link')">
          <AppIcon name="editor:link" />
        </button>
      </template>

      <FormEditorLink :editor />
    </AppDropdown>

    <div class="btn-group rounded-md">
      <button
        type="button"
        class="btn btn-sm"
        :class="isActive('bulletList')"
        @click="runCommand((chain) => chain.toggleBulletList())"
      >
        <AppIcon name="editor:ul" />
      </button>

      <button
        class="btn btn-sm"
        type="button"
        :class="isActive('orderedList')"
        @click="runCommand((chain) => chain.toggleOrderedList())"
      >
        <AppIcon name="editor:ol" />
      </button>
    </div>

    <div class="btn-group rounded-md">
      <button
        v-for="align in ['left', 'center', 'right']"
        :key="align"
        type="button"
        class="btn btn-sm"
        :class="isActive({ textAlign: align })"
        @click="runCommand((chain) => chain.setTextAlign(align))"
      >
        <AppIcon :name="`editor:align-${align}`" />
      </button>
    </div>

    <button
      type="button"
      class="btn btn-sm btn-default"
      :class="isActive('blockquote')"
      @click="runCommand((chain) => chain.toggleBlockquote())"
    >
      <AppIcon name="editor:quote" />
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3';
import type { Level } from '@tiptap/extension-heading';

const { editor } = defineProps<{ editor: Editor }>();

const runCommand = (command: (chain: ReturnType<Editor['chain']>) => ReturnType<Editor['chain']>) => {
  command(editor.chain().focus()).run();
};

const isActive = (type: string | object, attrs?: object) => {
  return editor.isActive(type as string, attrs) ? 'bg-accent/5 text-accent' : '';
};
</script>
