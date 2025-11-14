export default defineNuxtPlugin((nuxtApp) => {
  const { settings } = useAppConfig();

  if (!settings || !settings.key || !settings.theme) return;

  const current = ref(settings.theme);

  const { setItem, getItem } = useLocalStorage();

  const setupTheme = () => {
    const savedSettings = getItem(settings.key);

    if (savedSettings) updateAppConfig({ settings: savedSettings });

    const colorScheme = window.matchMedia('(prefers-color-scheme: dark)');

    colorScheme.addEventListener('change', (e: MediaQueryListEvent) => {
      settings.theme = e.matches ? 'dark' : 'light';
    });

    if (settings.theme === 'system') {
      settings.theme = colorScheme.matches ? 'dark' : 'light';
    }

    current.value = settings.theme;

    useHead({
      htmlAttrs: { class: () => settings.theme },
      meta: [
        { name: 'color-scheme', content: () => settings.theme },
        {
          name: 'theme-color',
          content: () => (settings.theme === 'dark' ? settings?.themeColor?.dark : settings?.themeColor?.light)
        }
      ]
    });
  };

  const toggleTheme = () => {
    if (document.startViewTransition) document.startViewTransition();

    settings.theme = settings.theme === 'dark' ? 'light' : 'dark';
    current.value = settings.theme;
    setItem(settings.key, settings);
  };

  nuxtApp.hook('app:mounted', setupTheme);

  return {
    provide: {
      theme: {
        current,
        toggleTheme
      }
    }
  };
});
