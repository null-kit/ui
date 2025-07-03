export const useBookmarks = () => {
  const { settings } = useAppConfig();

  if (!settings || !settings.bookmarks) throw new Error('Please provide bookmarks in app.config.ts');

  const route = useRoute();

  if (settings.bookmarks?.some((bookmark) => !bookmark)) {
    settings.bookmarks = [];
  }

  const toggleBookmark = (path: string) => {
    const bookmark = { label: String(route.meta.title), url: route.path };

    const exists = settings.bookmarks.findIndex((entry) => entry.url === path);

    if (exists >= 0) {
      settings.bookmarks.splice(exists, 1);
    } else {
      settings.bookmarks.push(bookmark);
    }
  };

  const isBookmarked = (path: string) => {
    return settings.bookmarks.some((entry) => entry.url === path);
  };

  return { toggleBookmark, isBookmarked };
};
