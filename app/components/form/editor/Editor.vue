<template>
  <div>
    <div v-if="label" class="form-label mb-2">
      {{ label }}

      <AppAppear v-if="required && !model">
        <span title="Required" class="form-required" />
      </AppAppear>
    </div>

    <div
      class="ring-edison bg-darwin hover:ring-surface/20 has-focus:ring-accent relative rounded-lg shadow ring transition dark:shadow-black/80"
    >
      <LazyFormEditorToolbar v-if="editor" :editor />

      <ClientOnly>
        <EditorContent :editor />
      </ClientOnly>

      <BubbleMenu v-if="editor" :editor>
        <div
          class="bg-darwin ring-edison divide-edison divide-y rounded-lg shadow-lg ring shadow-black/5 dark:shadow-black/30"
        >
          <LazyFormEditorLink v-if="editor.isActive('link')" :editor />
          <LazyFormEditorImage v-if="editor.isActive('image')" :editor />
          <LazyFormEditorYoutube v-if="editor.isActive('youtube')" :editor />
          <LazyFormEditorTable v-if="editor.isActive('table')" :editor />
        </div>
      </BubbleMenu>

      <FloatingMenu v-if="editor" :editor>
        <LazyFormEditorFloating :editor :path />
      </FloatingMenu>

      <FormValidate :name />
    </div>
  </div>
</template>

<script setup lang="ts">
import { EditorContent, useEditor, BubbleMenu, FloatingMenu } from '@tiptap/vue-3';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Heading from '@tiptap/extension-heading';
import Bold from '@tiptap/extension-bold';
import TextAlign from '@tiptap/extension-text-align';
import Blockquote from '@tiptap/extension-blockquote';
import Italic from '@tiptap/extension-italic';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';

// 2.14
import Placeholder from '@tiptap/extension-placeholder';
import Gapcursor from '@tiptap/extension-gapcursor';
import OrderedList from '@tiptap/extension-ordered-list';
import BulletList from '@tiptap/extension-bullet-list';
import ListItem from '@tiptap/extension-list-item';
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';

// TODO: 3.0.0
// import { BubbleMenu, FloatingMenu } from '@tiptap/vue-3/menus';
// import { OrderedList, BulletList, ListItem } from '@tiptap/extension-list';
// import { TableKit } from '@tiptap/extension-table';
// import { Gapcursor, Placeholder } from '@tiptap/extensions';

defineProps<{
  label?: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  path?: string;
}>();

const model = defineModel<string>();

const editor = useEditor({
  content: model.value,
  extensions: [
    Document,
    Paragraph,
    Text,
    Bold,
    Italic,
    Underline,
    BulletList,
    OrderedList,
    ListItem,
    Blockquote,
    Gapcursor,
    Table, // 2.14
    TableCell, // 2.14
    TableRow, // 2.14
    TableHeader, // 2.14
    Link.configure({ openOnClick: false }),
    Heading.configure({ levels: [2, 3, 4] }),
    Placeholder.configure({ placeholder: 'Enter Body' }),
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    Youtube.configure({ nocookie: true, modestBranding: true }),
    // TableKit.configure({ table: { resizable: true } }), // TODO: 3.0.0
    Image.extend({
      addAttributes() {
        return {
          ...this.parent?.(),
          class: { default: 'mr-auto' }
        };
      }
    }).configure({ inline: true })
  ],
  editorProps: {
    attributes: {
      class: 'outline-none min-h-10 p-4 article max-w-3xl mx-auto'
    }
  },
  onUpdate: ({ editor }) => {
    model.value = editor.getHTML();
  }
});

onBeforeUnmount(() => unref(editor)?.destroy());
</script>

<style scoped>
:deep(.tiptap) {
  :first-child {
    margin-top: 0;
  }

  p.is-editor-empty:first-child::before {
    color: var(--color-surface);
    opacity: 0.3;
    content: attr(data-placeholder);
    float: left;
    height: 0;
    pointer-events: none;
  }

  .ProseMirror-selectednode {
    outline: 3px solid var(--color-accent);
    border-radius: var(--radius-lg);
    transition: outline 0.2s ease-out;
  }

  .ProseMirror-gapcursor:after {
    border-color: var(--color-surface);
  }

  [data-youtube-video] {
    cursor: move;

    iframe {
      pointer-events: none;
    }
  }

  table {
    th,
    td {
      position: relative;
    }

    .selectedCell:after {
      background: var(--color-edison);
      content: '';
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      pointer-events: none;
      position: absolute;
      opacity: 0.3;
    }

    .column-resize-handle {
      background-color: var(--color-accent);
      bottom: 0;
      pointer-events: none;
      position: absolute;
      right: -1px;
      top: 0;
      width: 1px;
    }
  }

  &.resize-cursor {
    cursor: ew-resize;
    cursor: col-resize;
  }
}
</style>
