<template>
  <AppDropdown class="w-fit" dropdown-class="min-w-max">
    <template #trigger="{ isOpen }">
      <div :class="{ 'flex gap-px': dateMode }">
        <button
          :class="[
            'form-input flex items-center gap-2 hover:z-1',
            { 'ring-accent z-1': isOpen, 'rounded-r-none': dateMode }
          ]"
          :title="formatDateRange"
        >
          <AppIcon name="calendar" class="size-4 shrink-0 opacity-50" />
          <span class="truncate">{{ formatDateRange }}</span>
        </button>

        <template v-if="dateMode">
          <FormControl
            v-model="modelMode"
            type="select"
            placeholder="Group by"
            input-class="rounded-l-none"
            class="shrink-0"
            @click.stop
          >
            <option value="hour">by hour</option>
            <option value="day">by day</option>
            <option v-if="dateMode !== 'short'" value="week">by week</option>
            <option v-if="dateMode !== 'short'" value="month">by month</option>
          </FormControl>
        </template>
      </div>
    </template>

    <div class="space-y-2 p-1 text-center">
      <div class="flex justify-between gap-2">
        <button type="button" class="btn btn-sm px-2" @click="prevMonth">
          <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" class="size-5">
            <path fill="none" stroke-width="2" stroke="currentColor" d="m20 6-10 10 10 10" />
          </svg>
        </button>

        <div class="flex w-full justify-center gap-2 font-medium">
          <select
            v-model="currentMonth"
            class="cursor-pointer appearance-none bg-transparent text-center outline-none"
            @change="setYearMonth"
          >
            <option v-for="(month, index) in months" :key="index" :value="index">
              {{ month }}
            </option>
          </select>

          <select
            v-model="currentYear"
            class="cursor-pointer appearance-none bg-transparent text-center outline-none"
            @change="setYearMonth"
          >
            <option v-for="year in years" :key="year" :value="year">
              {{ year }}
            </option>
          </select>
        </div>

        <button type="button" class="btn btn-sm px-2" @click="nextMonth">
          <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" class="size-5">
            <path fill="none" stroke-width="2" stroke="currentColor" d="m12 26 10-10-10-10" />
          </svg>
        </button>
      </div>

      <div class="ring-edison grid min-w-max grid-cols-7 overflow-hidden rounded-md ring dark:shadow dark:shadow-black">
        <div v-for="day in days" :key="day" class="p-1 text-xs font-medium uppercase opacity-40">
          {{ day }}
        </div>

        <button
          v-for="(date, index) in dates"
          :key="index"
          type="button"
          class="bg-darwin ring-edison disabled:text-surface/40 p-1 ring disabled:cursor-not-allowed"
          :disabled="isDisabled(date)"
          @click="selectDate(date)"
        >
          <span
            :class="[
              'mx-auto grid size-8 place-items-center rounded-full duration-200',
              { 'opacity-40': isOutside(date) },
              { 'bg-accent/20 text-accent': inRange(date) },
              isSelected(date) ? 'bg-accent hover:bg-accent text-white' : 'hover:bg-accent/20 hover:text-accent'
            ]"
          >
            {{ date.getDate() }}
          </span>
        </button>
      </div>

      <div v-if="range" class="grid grid-cols-2 gap-2 rounded-md">
        <button type="button" class="btn btn-sm btn-default" @click="setPreset('today')">Today</button>
        <button type="button" class="btn btn-sm btn-default" @click="setPreset('this-month')">This Month</button>

        <button type="button" class="btn btn-sm btn-default" @click="setPreset('last-week')">Last Week</button>
        <button type="button" class="btn btn-sm btn-default" @click="setPreset('last-month')">Last Month</button>
      </div>
    </div>
  </AppDropdown>
</template>

<script setup lang="ts">
type Preset = 'today' | 'yesterday' | 'last-week' | 'this-month' | 'last-month';

const { disabledDates = [], ...props } = defineProps<{
  range?: boolean;
  disabledDates?: Date[];
  dateMode?: boolean | 'short';
  iso?: boolean;
  preset?: Preset;
}>();

const [model, modifiers] = defineModel<Date | Date[] | string | undefined>({
  required: true,
  set(value) {
    if (value && modifiers.iso) {
      if (Array.isArray(value)) return value.map((date) => formatDate(date, { format: 'iso' }));

      return formatDate(value, { format: 'iso' });
    }

    return value;
  }
});

const modelMode = defineModel<'day' | 'hour' | 'week' | 'month'>('mode');

const selectedDates = ref<Date[]>([]);

const days = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

const currentDate = ref(new Date());
const currentMonth = ref(currentDate.value.getMonth());
const currentYear = ref(currentDate.value.getFullYear());

const years = computed(() => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);
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
  if (props.range) return selectedDates.value.map((date) => formatDate(date)).join(' - ');

  return String(formatDate(selectedDates.value[0]!));
});

const prevMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
};

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
};

const setYearMonth = () => {
  currentDate.value = new Date(currentYear.value, currentMonth.value, 1);
};

const selectDate = (date: Date) => {
  if (isDisabled(date)) return;

  if (props.range) {
    if (selectedDates.value.length === 2) {
      selectedDates.value = [date];
    } else {
      selectedDates.value.push(date);
      selectedDates.value.sort((a, b) => a.getTime() - b.getTime());

      if (selectedDates.value.length === 2) {
        model.value = selectedDates.value.map((d) => formatDate(d, modifiers.iso && { format: 'iso' }));
      }
    }
  } else {
    selectedDates.value = [date];
    model.value = modifiers.iso ? formatDate(date, { format: 'iso' }) : date;
  }

  currentMonth.value = date.getMonth();
  currentYear.value = date.getFullYear();
};

const isSelected = (date: Date) => {
  return selectedDates.value.some((d) => d.toDateString() === date.toDateString());
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

const isDisabled = (date: Date) => {
  return disabledDates.some((d) => new Date(d).toDateString() === date.toDateString());
};

const setPreset = (type: Preset) => {
  const today = new Date();

  switch (type) {
    case 'today':
      selectDate(today);
      break;
    case 'yesterday':
      selectDate(new Date(today.setDate(today.getDate() - 1)));
      break;
    case 'last-week':
      selectDate(new Date(today.setDate(today.getDate() - 7)));
      selectDate(new Date());
      break;
    case 'this-month':
      selectDate(new Date(today.getFullYear(), today.getMonth(), 1));
      selectDate(new Date(today.getFullYear(), today.getMonth() + 1, 0));
      break;
    case 'last-month':
      selectDate(new Date(today.getFullYear(), today.getMonth() - 1, 1));
      selectDate(new Date(today.getFullYear(), today.getMonth(), 0));
      break;
  }
};

onMounted(() => {
  if (props.range && model.value) {
    selectedDates.value = Array.isArray(model.value) ? model.value.map((d) => new Date(d)) : [new Date(model.value)];
  }

  if (props.preset) setPreset(props.preset);

  if (props.dateMode && !modelMode.value) modelMode.value = 'day';
});

watch(model, (value) => {
  if (props.range && Array.isArray(value) && value.length <= 0) {
    selectedDates.value = [];
  }
});
</script>
