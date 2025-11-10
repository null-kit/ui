<template>
  <div>
    <div class="form-input flex items-center">
      <AppIcon v-if="!noIcon" :name="icon" class="mr-2 size-4 shrink-0" />

      <template v-for="(segment, index) in timeSegments" :key="index">
        <AppDropdown dropdown-class="-ml-0.5 -mt-1" no-toggle>
          <template #trigger>
            <input
              v-model="time[segment].current"
              class="appearance-none outline-none [&::-webkit-calendar-picker-indicator]:hidden"
              type="time"
              :name
              step="2"
              @change="onScrollTo"
            />
          </template>

          <div class="flex mask-y-from-60%" @vue:mounted="onScrollTo">
            <div
              class="flex max-h-20 flex-1 snap-y flex-col items-center overflow-auto py-8 [scrollbar-width:none]"
              @scrollend="onScrollEnd($event, 'hour', segment)"
            >
              <button
                v-for="hour in time23"
                :key="hour"
                :id="`${segment}-hour-${hour}`"
                type="button"
                class="snap-center"
                @click="onSetTime(hour, 'hour', segment)"
              >
                {{ hour }}
              </button>
            </div>

            <span class="self-center">:</span>

            <div
              class="flex max-h-20 flex-1 snap-y flex-col items-center overflow-auto py-8 [scrollbar-width:none]"
              @scrollend="onScrollEnd($event, 'minute', segment)"
            >
              <button
                v-for="minute in time59"
                :key="minute"
                :id="`${segment}-minute-${minute}`"
                type="button"
                class="snap-center"
                @click="onSetTime(minute, 'minute', segment)"
              >
                {{ minute }}
              </button>
            </div>

            <span class="self-center">:</span>

            <div
              class="flex max-h-20 flex-1 snap-y flex-col items-center overflow-auto py-8 [scrollbar-width:none]"
              @scrollend="onScrollEnd($event, 'second', segment)"
            >
              <button
                v-for="second in time59"
                :key="second"
                :id="`${segment}-second-${second}`"
                type="button"
                class="snap-center"
                @click="onSetTime(second, 'second', segment)"
              >
                {{ second }}
              </button>
            </div>
          </div>
        </AppDropdown>

        <span v-if="index < timeSegments.length - 1" class="cursor-default select-none">&nbsp;-&nbsp;</span>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
type TimeSegment = 'start' | 'end';
type TimeType = 'hour' | 'minute' | 'second';

const model = defineModel<string | string[]>({ required: true });

const props = withDefaults(
  defineProps<{
    name?: string;
    step?: number;
    icon?: string;
    noIcon?: boolean;
    range?: boolean;
  }>(),
  {
    icon: 'clock'
  }
);

const timeSegments: TimeSegment[] = props.range ? ['start', 'end'] : ['start'];

const time59 = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

const time23 = time59.slice(0, 24);

const time = reactive({
  start: {
    hour: '00',
    minute: '00',
    second: '00',
    current: '00:00:00'
  },
  end: {
    hour: '00',
    minute: '00',
    second: '00',
    current: '00:00:00'
  }
});

const onSetTime = (value: string, type: TimeType, segment: TimeSegment) => {
  const target = document.getElementById(`${segment}-${type}-${value}`);

  target?.scrollIntoView({ block: 'center', behavior: 'smooth' });

  time[segment][type] = value;

  time[segment].current = `${time[segment].hour}:${time[segment].minute}:${time[segment].second}`;
};

const onScrollEnd = (event: Event, type: TimeType, segment: TimeSegment) => {
  const target = (event.currentTarget || event.target) as HTMLElement | null;

  if (!target) return;

  const buttons = Array.from(target.querySelectorAll<HTMLButtonElement>('button'));

  if (buttons.length === 0) return;

  const containerRect = target.getBoundingClientRect();
  const containerCenterY = containerRect.top + containerRect.height / 2;

  let closestButton: HTMLButtonElement | null = null;
  let smallestDistance = Number.POSITIVE_INFINITY;

  for (const button of buttons) {
    const rect = button.getBoundingClientRect();
    const buttonCenterY = rect.top + rect.height / 2;
    const distance = Math.abs(buttonCenterY - containerCenterY);

    if (distance < smallestDistance) {
      smallestDistance = distance;
      closestButton = button;
    }
  }

  if (!closestButton) return;

  const value = closestButton.textContent?.trim().padStart(2, '0');

  if (time[segment][type] === value) return;

  onSetTime(value, type, segment);
};

const onScrollTo = () => {
  for (const segment of timeSegments) {
    const [hour, minute, second] = time[segment].current.split(':');

    time[segment].hour = hour || '00';
    time[segment].minute = minute || '00';
    time[segment].second = second || '00';

    for (const type of ['hour', 'minute', 'second']) {
      const value = time[segment][type as TimeType];
      const target = document.getElementById(`${segment}-${type}-${value}`);

      if (!target) continue;

      target?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  }
};

onMounted(() => {
  const defaultTime = '00:00:00';

  if (Array.isArray(model.value)) {
    if (props.range) {
      time.start.current = model.value[0] || defaultTime;
      time.end.current = model.value[1] || defaultTime;
    } else {
      time.start.current = model.value[0] || defaultTime;
    }
  }

  if (typeof model.value === 'string') {
    time.start.current = model.value || defaultTime;
  }
});
</script>
