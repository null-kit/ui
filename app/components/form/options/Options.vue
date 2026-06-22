<template>
  <div class="scrollbar scrollbar-thin flex-1 overflow-auto" :style="maxHeight ? { maxHeight } : undefined">
    <slot name="before" />

    <template v-for="(optionGroup, indexParent) in groups" :key="indexParent">
      <div v-if="optionGroup.group" class="select-group-label">
        {{ optionGroup.group }}
      </div>

      <div v-if="optionGroup.list.length > 0" class="select-options">
        <template v-for="(option, index) in optionGroup.list" :key="index">
          <slot
            name="option"
            :value="option"
            :is-selected="isSelected(option)"
            :on-select="() => emit('select', option)"
            :on-toggle="() => emit('select', option)"
          >
            <button
              v-if="!isHidden?.(option)"
              type="button"
              class="btn justify-start"
              :class="{
                'bg-current/5 font-medium': isSelected(option),
                '-order-1': isSelected(option) && order
              }"
              @mousedown.prevent="emit('select', option)"
            >
              <svg
                v-if="variant === 'select'"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                class="size-4 shrink-0"
              >
                <path
                  fill="none"
                  stroke-width="3"
                  d="m5 18 7 7L27 9"
                  class="duration-300"
                  stroke="currentColor"
                  stroke-dasharray="32"
                  :style="{ strokeDashoffset: isSelected(option) ? 0 : 32 }"
                />
              </svg>

              <slot name="button" :value="option" :is-selected="isSelected(option)">
                {{ getKeyName(option) }}
              </slot>
            </button>
          </slot>
        </template>
      </div>
    </template>

    <slot name="after" />
  </div>
</template>

<script setup lang="ts" generic="T extends Record<string, unknown> | string | number">
const emit = defineEmits<{ select: [option: T] }>();

withDefaults(
  defineProps<{
    groups: OptionGroup<T>[];
    getKeyName: (option: T) => unknown;
    isSelected: (option: T) => boolean;
    isHidden?: (option: T) => boolean;
    variant?: 'select' | 'pick';
    order?: boolean;
    maxHeight?: string;
  }>(),
  {
    variant: 'select'
  }
);
</script>
