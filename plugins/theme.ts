export default defineNuxtPlugin((nuxtApp) => {
  const { settings } = useAppConfig();

  if (!settings || !settings.key || !settings.theme) return;

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

    useHead({
      htmlAttrs: { class: () => settings.theme },
      meta: [
        { name: 'color-scheme', content: () => settings.theme },
        {
          name: 'theme-color',
          content: () =>
            settings.theme === 'dark' ? (settings?.themeColor?.dark ?? '#000') : (settings?.themeColor?.light ?? '#fff')
        }
      ]
    });
  };

  const toggleTheme = () => {
    settings.theme = settings.theme === 'dark' ? 'light' : 'dark';
    setItem(settings.key, settings);
  };

  nuxtApp.hook('app:mounted', setupTheme);

  return {
    provide: {
      theme: {
        toggleTheme
      }
    }
  };
});
