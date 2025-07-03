export const useTour = () => {
  const { app } = useRuntimeConfig().public;
  const { getItem, setItem } = useLocalStorage();

  if (!app || !app.name) throw new Error('Please provide app name in nuxt.config.ts');

  const appName = app.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();

  const activeKey = `${appName}-active-tour`;
  const endedKey = `${appName}-ended-tours`;

  const activeTour = getItem(activeKey);
  const endedTours = getItem(endedKey) || [];

  const tour = useState('active-tour', () => ({
    active: false,
    currentStep: activeTour?.currentStep ?? 0,
    target: activeTour?.target
  }));

  const setTourStep = (step: number, callback?: () => void) => {
    if (tour.value.active) tour.value.currentStep = step;

    if (callback) callback();

    setItem(activeKey, { currentStep: step, target: tour.value.target });
  };

  const onTargetClick = (step: string) => {
    const element = document.querySelector<HTMLButtonElement>(`[data-${tour.value.target}="${step}"]`);

    if (element) element.click();
  };

  const onTourEnd = () => {
    if (!tour.value.target) return;

    if (!endedTours.includes(tour.value.target)) {
      endedTours.push(tour.value.target);
    }

    setItem(endedKey, endedTours);
    setItem(activeKey, undefined);

    tour.value.active = false;
  };

  const onTourRestart = (name: string) => {
    const restartedTour = endedTours.filter((tour: string) => tour !== name);

    setItem(endedKey, restartedTour);
    setItem(activeKey, undefined);

    window.location.reload();
  };

  const hasActiveTour = (target: string) => {
    tour.value.active = !endedTours.includes(target);
  };

  return {
    tour,
    setTourStep,
    onTargetClick,
    onTourEnd,
    onTourRestart,
    hasActiveTour
  };
};
