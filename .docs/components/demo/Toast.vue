<template>
  <fieldset id="toasts">
    <legend>Toasts</legend>

    <div class="flex gap-4">
      <button
        type="button"
        class="btn btn-default"
        @click="setToast({ title: 'Nice!', text: 'This is a default toast!', type: 'default' })"
      >
        Default Toast
      </button>

      <button
        type="button"
        class="btn btn-default"
        @click="
          setToast({
            title: 'Success!',
            text: 'Your operation was successful!',
            type: 'success'
          })
        "
      >
        Success Toast
      </button>

      <button
        type="button"
        class="btn btn-default"
        @click="setToast({ title: 'Error!', text: 'Your operation was failed!', type: 'error' })"
      >
        Error Toast
      </button>

      <button
        type="button"
        class="btn btn-default"
        @click="setToast({ title: 'Info!', text: 'Your operation was okay!', type: 'info' })"
      >
        Info Toast
      </button>
    </div>
  </fieldset>
</template>

<script setup lang="ts">
import { useToast } from '../../../app/composables/use-toast';

const { setToast } = useToast();
</script>
