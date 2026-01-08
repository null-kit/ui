<template>
  <Teleport to="#teleports">
    <div
      v-if="reference && stepInfo"
      ref="floating"
      :style="floatingStyles"
      class="bg-newton text-surface inverted z-19 max-w-xs rounded-xl p-3 duration-500"
      :class="{ 'pointer-events-none opacity-0': middlewareData.hide?.referenceHidden }"
    >
      <slot :name="`step-${tour.currentStep}`" />

      <h2 class="mb-1 text-sm font-semibold">{{ stepInfo.title }}</h2>
      <p class="text-sm" v-html="stepInfo.text" />

      <div class="mt-3 flex gap-2">
        <button v-if="!stepInfo.isEnd" type="button" class="btn btn-sm btn-default mr-auto" @click="onTourEnd">
          Skip
        </button>

        <button
          v-if="stepInfo.prevButton !== false && !stepInfo.isEnd"
          type="button"
          class="btn btn-sm"
          @click="onPrevStep"
        >
          <AppIcon name="chevron-left" />
        </button>

        <button
          v-if="stepInfo.nextButton !== false && !stepInfo.isEnd"
          type="button"
          class="btn btn-accent btn-sm"
          @click="onNextStep"
        >
          <AppIcon name="chevron-right" />
        </button>

        <button v-if="stepInfo.isEnd" type="button" class="btn btn-main btn-sm ml-auto" @click="onTourEnd">
          End Tour
        </button>
      </div>

      <div ref="floatingArrow" class="bg-newton absolute size-2 rotate-45" />
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { offset, shift, autoPlacement, useFloating, autoUpdate, arrow, hide } from '@floating-ui/vue';

const { steps, target } = defineProps<{ steps: TourStep[]; target: string }>();

const { tour, onTourEnd, setTourStep } = useTour();

const stepInfo = computed(() => steps[tour.value.currentStep]);

const reference = ref<HTMLElement | null>(null);
const floating = useTemplateRef<HTMLDivElement>('floating');
const floatingArrow = useTemplateRef<HTMLDivElement>('floatingArrow');

const { floatingStyles, middlewareData, placement } = useFloating(reference, floating, {
  middleware: [
    offset(8),
    shift({ padding: 8 }),
    autoPlacement({ padding: 8 }),
    hide(),
    arrow({ element: floatingArrow })
  ],
  whileElementsMounted(...args) {
    return autoUpdate(...args, { layoutShift: false, animationFrame: true });
  }
});

const onPrevStep = () => {
  if (stepInfo.value?.onPrev) stepInfo.value.onPrev();

  tour.value.currentStep--;

  if (stepInfo.value?.ignore) tour.value.currentStep--;
};

const onNextStep = async () => {
  if (stepInfo.value?.onNext) stepInfo.value.onNext();

  tour.value.currentStep++;

  if (stepInfo.value?.ignore) tour.value.currentStep++;
};

const onUpdateReference = async () => {
  tour.value.target = target;

  if (stepInfo.value?.onEnter) stepInfo.value.onEnter();

  const selector = `[data-${target}="${stepInfo.value?.step ?? tour.value.currentStep}"]`;

  reference.value = await new Promise((resolve) => {
    const element = document.querySelector<HTMLElement>(selector);

    if (element) return resolve(element);

    const observer = new MutationObserver(() => {
      const element = document.querySelector<HTMLElement>(selector);

      if (element) {
        observer.disconnect();
        resolve(element);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  });

  if (!reference.value) return;

  reference.value.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });

  setTourStep(tour.value.currentStep);
};

const onUpdateArrow = () => {
  if (!floatingArrow.value) return;

  const side = placement.value.split('-')[0];

  if (side) {
    const staticSide = { top: 'bottom', right: 'left', bottom: 'top', left: 'right' }[side];

    if (middlewareData.value.arrow && staticSide) {
      const { x, y, centerOffset } = middlewareData.value.arrow;

      Object.assign(floatingArrow.value.style, {
        left: x != null ? `${x}px` : '',
        top: y != null ? `${y}px` : '',
        opacity: centerOffset >= 0 ? 1 : 0,
        [staticSide]: `${-floatingArrow.value.offsetWidth / 2}px`
      });
    }
  }
};

watch([stepInfo, () => useRoute().path], onUpdateReference, { immediate: true });
watch(middlewareData, onUpdateArrow, { immediate: true });
</script>
