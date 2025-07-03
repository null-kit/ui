export default defineAppConfig({
  settings: {
    key: 'theme',
    theme: 'system',
    bookmarks: []
  }
});

declare module '@nuxt/schema' {
  interface AppConfigInput {
    settings: {
      key: string;
      theme: 'system' | 'light' | 'dark';
      bookmarks: Array<{
        label: string;
        icon?: string;
        url: string;
      }>;
    };
  }
}
