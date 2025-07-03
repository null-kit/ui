import type { Placement } from '@floating-ui/vue';

export type TourStep = {
  title: string;
  text: string;
  placement?: Placement;
  prevButton?: boolean;
  nextButton?: boolean;
  isEnd?: boolean;
  step?: number;
  onEnter?: () => void;
  onNext?: () => void;
};
