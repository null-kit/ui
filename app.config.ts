export default defineAppConfig({
  settings: {
    key: 'theme',
    theme: 'system',
    themeColor: {
      light: '#000',
      dark: '#fff'
    },
    bookmarks: []
  }
});

declare module '@nuxt/schema' {
  interface AppConfigInput {
    settings: {
      key: string;
      theme: 'system' | 'light' | 'dark';
      themeColor: {
        light: string;
        dark: string;
      };
      bookmarks: Array<{
        label: string;
        icon?: string;
        url: string;
      }>;
    };
  }
}
