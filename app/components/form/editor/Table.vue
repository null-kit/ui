<template>
  <div class="btn-group">
    <button type="button" class="btn btn-sm" @click="runCommand((chain) => chain.addColumnBefore())">
      <AppIcon name="editor:cell-left-add" />
    </button>

    <button type="button" class="btn btn-sm" @click="runCommand((chain) => chain.addColumnAfter())">
      <AppIcon name="editor:cell-right-add" />
    </button>

    <button type="button" class="btn btn-sm" @click="runCommand((chain) => chain.deleteColumn())">
      <AppIcon name="editor:cell-right-remove" />
    </button>

    <div class="bg-surface/5 w-1" />

    <button type="button" class="btn btn-sm" @click="runCommand((chain) => chain.addRowBefore())">
      <AppIcon name="editor:row-top-add" />
    </button>

    <button type="button" class="btn btn-sm" @click="runCommand((chain) => chain.addRowAfter())">
      <AppIcon name="editor:row-bottom-add" />
    </button>

    <button type="button" class="btn btn-sm" @click="runCommand((chain) => chain.deleteRow())">
      <AppIcon name="editor:row-bottom-remove" />
    </button>

    <div class="bg-surface/5 w-1" />

    <button type="button" class="btn btn-default btn-sm" @click="runCommand((chain) => chain.mergeOrSplit())">
      <AppIcon name="editor:join" />
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3';

const { editor } = defineProps<{ editor: Editor }>();

const runCommand = (command: (chain: ReturnType<Editor['chain']>) => ReturnType<Editor['chain']>) => {
  command(editor.chain().focus()).run();
};
</script>
