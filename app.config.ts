declare module '@nuxt/schema' {
  interface CustomAppConfig {
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
      [key: string]: unknown;
    };
  }
}

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
