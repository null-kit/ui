export const useLocalStorage = () => {
  const getItem = <T>(key: string): T | undefined => {
    try {
      const parsedItem = localStorage.getItem(key);

      if (parsedItem) return JSON.parse(parsedItem);
    } catch (error) {
      console.error(error);
      localStorage.removeItem(key);
    }
  };

  const setItem = <T>(key: string, data: T) => {
    if (!data || (Array.isArray(data) && data.length === 0)) return localStorage.removeItem(key);

    localStorage.setItem(key, JSON.stringify(data));
  };

  const removeItem = (key: string) => {
    localStorage.removeItem(key);
  };

  return {
    getItem,
    setItem,
    removeItem
  };
};
