declare module '@nuxt/schema' {
  interface AppConfig {
    settings: {
      ddd: string;
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

export {};
