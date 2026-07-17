<template>
  <AppDropdown ref="dropdown" class="w-fit" dropdown-class="min-w-max" :placement @close="onClose">
    <template #trigger="{ isOpen }">
      <button
        type="button"
        :class="['form-input flex items-center gap-2 hover:z-1', { 'ring-accent z-1': isOpen }]"
        :title="formatDateRange"
      >
        <AppIcon v-if="!noIcon" :name="icon" class="size-4 shrink-0" />
        <span class="truncate">{{ formatDateRange }}</span>
      </button>
    </template>

    <div class="space-y-2 p-2 text-center">
      <div class="flex justify-between gap-2">
        <button type="button" class="btn btn-sm px-2" @click="onPrevMonth">
          <slot name="prev-icon">
            <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" class="size-5">
              <path fill="none" stroke-width="2" stroke="currentColor" d="m20 6-10 10 10 10" />
            </svg>
          </slot>
        </button>

        <div class="flex w-full justify-center gap-1 font-medium">
          <button type="button" class="btn btn-sm" @click="onTogglePicker('month')">
            {{ months[currentMonth] }}
          </button>

          <button type="button" class="btn btn-sm" @click="onTogglePicker('year')">
            {{ currentYear }}
          </button>
        </div>

        <button type="button" class="btn btn-sm px-2" @click="onNextMonth">
          <slot name="next-icon">
            <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" class="size-5">
              <path fill="none" stroke-width="2" stroke="currentColor" d="m12 26 10-10-10-10" />
            </svg>
          </slot>
        </button>
      </div>

      <Transition
        enter-from-class="opacity-0 translate-x-2"
        enter-to-class="duration-200 ease-in-out"
        leave-to-class="opacity-0 -translate-x-2 duration-200 ease-in-out"
        mode="out-in"
      >
        <div v-if="pickerView === 'month'" class="grid min-w-max grid-cols-3 gap-2">
          <button
            v-for="(month, index) in months"
            :key="index"
            type="button"
            class="btn btn-sm btn-default"
            :class="index === currentMonth ? 'btn-main' : 'btn-default'"
            @click="onSelectMonth(index)"
          >
            {{ month.slice(0, 3) }}
          </button>
        </div>

        <div v-else-if="pickerView === 'year'" class="grid min-w-max grid-cols-3 gap-2">
          <button
            v-for="year in years"
            :key="year"
            type="button"
            class="btn btn-sm"
            :class="year === currentYear ? 'btn-main' : 'btn-default'"
            @click="onSelectYear(year)"
          >
            {{ year }}
          </button>
        </div>

        <div v-else>
          <div class="datepicker grid min-w-max grid-cols-7">
            <div v-for="day in days" :key="day" class="p-1 text-xs font-medium uppercase opacity-40">
              {{ day }}
            </div>

            <button
              v-for="(date, index) in dates"
              :key="index"
              type="button"
              class="datepicker-day"
              :class="{
                'day-selected': isSelected(date),
                'day-selected-safe': modifiers.safe && !isToday(date) && isSelected(date, true),
                'day-in-range': inRange(date),
                'day-outside': isOutside(date),
                'day-today': isToday(date)
              }"
              :disabled="isDisabled(date)"
              :title="modifiers.safe && !isToday(date) && isSelected(date, true) ? 'Selected in UTC' : undefined"
              @click="onSetDate(date)"
            >
              <span class="datepicker-day-inner">
                {{ date.getDate() }}
              </span>
            </button>
          </div>

          <div v-if="range" class="mt-2 grid grid-cols-2 gap-2">
            <slot name="presets" :on-set-preset>
              <button
                v-for="p in presets"
                :key="p.key"
                type="button"
                class="btn btn-sm btn-default"
                @click="onSetPreset(p.key)"
              >
                {{ p.name }}
              </button>

              <button
                v-if="rangeYear"
                type="button"
                class="btn btn-sm btn-default"
                :class="{ 'col-span-2': !rangeQuarter }"
                @click="onSetPreset('this-year')"
              >
                This Year
              </button>

              <div v-if="rangeQuarter" class="btn-group" :class="{ 'col-span-2': !rangeYear }">
                <button
                  v-for="q in 4"
                  :key="q"
                  type="button"
                  class="btn btn-sm btn-default"
                  :disabled="!isQuarterReady(q)"
                  @click="onSetPreset(`q${q}` as Preset)"
                >
                  {{ `Q${q}` }}
                </button>
              </div>

              <slot name="preset" :on-set-preset />
            </slot>
          </div>
        </div>
      </Transition>
    </div>
  </AppDropdown>
</template>

<script setup lang="ts">
import type { Placement } from '@floating-ui/vue';

type Preset = 'today' | 'yesterday' | `last-${'month' | '7' | '30'}` | `this-${'month' | 'year'}` | `q${1 | 2 | 3 | 4}`;

const {
  disabledDates = [],
  icon = 'calendar',
  ...props
} = defineProps<{
  range?: boolean;
  disabledDates?: Date[];
  preset?: Preset;
  includeToday?: boolean;
  rangeYear?: boolean;
  rangeQuarter?: boolean;
  maxToday?: boolean;
  icon?: string;
  noIcon?: boolean;
  autoclose?: boolean;
  placement?: Placement;
}>();

const [model, modifiers] = defineModel<(Date | string)[] | Date | string>({
  required: true,
  set: (value) => {
    const result = Array.isArray(value) ? value.map(formatWithModifiers) : formatWithModifiers(value);

    return result;
  }
});

const formatWithModifiers = (date: Date | string) => {
  if (modifiers.iso && modifiers.safe) return formatSafeISO(date);
  if (modifiers.iso) return formatISO(date);

  return date;
};

const dropdown = useTemplateRef('dropdown');

const selectedDates = ref<Date[]>([]);

const presets: Array<{ name: string; key: Preset }> = [
  { name: 'Today', key: 'today' },
  { name: 'Yesterday', key: 'yesterday' },
  { name: 'Last 7 Days', key: 'last-7' },
  { name: 'Last 30 Days', key: 'last-30' },
  { name: 'This Month', key: 'this-month' },
  { name: 'Last Month', key: 'last-month' }
];

const days = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

const months = Array.from({ length: 12 }, (_, i) => {
  return new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(new Date().getFullYear(), i, 1));
});

const currentDate = ref(new Date());
const currentMonth = ref(currentDate.value.getMonth());
const currentYear = ref(currentDate.value.getFullYear());
const pickerView = ref<'month' | 'year' | null>(null);

const years = computed(() => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 12 }, (_, i) => currentYear - 6 + i);
});

const dates = computed(() => {
  const firstDay = new Date(currentYear.value, currentMonth.value, 1);
  const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0);
  const days: Date[] = [];

  let startDay = firstDay.getDay() - 1;

  if (startDay === -1) startDay = 6;

  const totalCells = Math.ceil((lastDay.getDate() + startDay) / 7) * 7;

  for (let i = 1; i <= totalCells; i++) {
    const date = new Date(currentYear.value, currentMonth.value, i - startDay);
    days.push(date);
  }

  return days;
});

const formatDateRange = computed(() => {
  if (selectedDates.value.length === 0) return props.range ? 'Select dates' : 'Select date';
  if (props.range) return selectedDates.value.map((date) => formatDate(date, { safe: modifiers.safe })).join(' - ');

  return String(formatDate(selectedDates.value[0]!));
});

const onPrevMonth = () => {
  pickerView.value = null;

  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
};

const onNextMonth = () => {
  pickerView.value = null;

  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
};

const onSetYearMonth = () => {
  currentDate.value = new Date(currentYear.value, currentMonth.value, 1);
};

const onTogglePicker = (view: 'month' | 'year') => {
  pickerView.value = pickerView.value === view ? null : view;
};

const onSelectMonth = (index: number) => {
  currentMonth.value = index;
  onSetYearMonth();
  pickerView.value = null;
};

const onSelectYear = (year: number) => {
  currentYear.value = year;
  onSetYearMonth();
  pickerView.value = null;
};

const onSetDate = (date: Date) => {
  if (isDisabled(date)) return;

  if (props.range) {
    if (selectedDates.value.length === 2) {
      selectedDates.value = [date];
    } else {
      selectedDates.value.push(date);
      selectedDates.value.sort((a, b) => a.getTime() - b.getTime());

      if (selectedDates.value.length === 2) {
        model.value = selectedDates.value.map(formatWithModifiers);

        if (props.autoclose) dropdown.value?.onClose();
      }
    }
  } else {
    selectedDates.value = [date];
    model.value = formatWithModifiers(date);

    if (props.autoclose) dropdown.value?.onClose();
  }

  currentMonth.value = date.getMonth();
  currentYear.value = date.getFullYear();
};

const isToday = (date: Date) => {
  return date.toDateString() === new Date().toDateString();
};

const isSelected = (date: Date, safe: boolean = false) => {
  return selectedDates.value.some((d) => {
    return safe ? formatSafeISO(d) === formatSafeISO(date) : d.toDateString() === date.toDateString();
  });
};

const inRange = (date: Date) => {
  if (props.range && selectedDates.value.length === 2 && selectedDates.value[0] && selectedDates.value[1]) {
    const endDate = new Date(selectedDates.value[1]);
    endDate.setDate(endDate.getDate() - 1);

    return date > selectedDates.value[0] && date <= endDate;
  }

  return false;
};

const isOutside = (date: Date) => date.getMonth() !== currentMonth.value;

const isQuarterReady = (quarter: number) => {
  const today = new Date();
  const month = today.getMonth();
  const startMonth = (quarter - 1) * 3;

  if (month < startMonth) return false;

  if (props.maxToday) return true;

  return month >= quarter * 3;
};

const isDisabled = (date: Date) => {
  if (disabledDates.some((d) => new Date(d).toDateString() === date.toDateString())) {
    return true;
  }

  if (props.maxToday) {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return date > today;
  }

  return false;
};

const onClose = () => {
  pickerView.value = null;

  if (props.range && selectedDates.value[0] && !selectedDates.value[1]) {
    onSetDate(selectedDates.value[0]);
  }
};

const onSetPreset = (type: Preset) => {
  pickerView.value = null;

  const today = new Date();

  switch (type) {
    case 'today':
      onSetDate(today);
      if (props.range) onSetDate(today);
      break;
    case 'yesterday':
      onSetDate(setDate(today, -1));
      if (props.range) onSetDate(setDate(today, -1));
      break;
    case 'last-7':
      onSetDate(props.includeToday ? setDate(today, -6) : setDate(today, -7));
      onSetDate(props.includeToday ? today : setDate(today, -1));
      break;
    case 'last-30':
      onSetDate(props.includeToday ? setDate(today, -29) : setDate(today, -30));
      onSetDate(props.includeToday ? today : setDate(today, -1));
      break;
    case 'this-month':
      onSetDate(new Date(today.getFullYear(), today.getMonth(), 1));
      if (props.maxToday) onSetDate(today);
      else onSetDate(new Date(today.getFullYear(), today.getMonth() + 1, 0));
      break;
    case 'last-month':
      onSetDate(new Date(today.getFullYear(), today.getMonth() - 1, 1));
      onSetDate(new Date(today.getFullYear(), today.getMonth(), 0));
      break;
    case 'this-year':
      onSetDate(new Date(today.getFullYear(), 0, 1));
      if (props.maxToday) onSetDate(today);
      else onSetDate(new Date(today.getFullYear(), 12, 0));
      break;
    case 'q1':
      onSetDate(new Date(today.getFullYear(), 0, 1));
      if (props.maxToday && today.getMonth() < 3) onSetDate(today);
      else onSetDate(new Date(today.getFullYear(), 3, 0));
      break;
    case 'q2':
      onSetDate(new Date(today.getFullYear(), 3, 1));
      if (props.maxToday && today.getMonth() < 6) onSetDate(today);
      else onSetDate(new Date(today.getFullYear(), 6, 0));
      break;
    case 'q3':
      onSetDate(new Date(today.getFullYear(), 6, 1));
      if (props.maxToday && today.getMonth() < 9) onSetDate(today);
      else onSetDate(new Date(today.getFullYear(), 9, 0));
      break;
    case 'q4':
      onSetDate(new Date(today.getFullYear(), 9, 1));
      if (props.maxToday && today.getMonth() < 12) onSetDate(today);
      else onSetDate(new Date(today.getFullYear(), 12, 0));
      break;
  }
};

onMounted(() => {
  if (props.range && model.value) {
    selectedDates.value = Array.isArray(model.value) ? model.value.map((d) => new Date(d)) : [new Date(model.value)];
  }

  if (props.preset) onSetPreset(props.preset);
});

watch(model, (value) => {
  if (props.range && Array.isArray(value) && value.length <= 0) {
    selectedDates.value = [];
  }
});
</script>
