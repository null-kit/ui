export const useLocalStorage = () => {
  const getItem = (key: string) => {
    try {
      const parsedItem = localStorage.getItem(key);

      if (parsedItem) return JSON.parse(parsedItem);
    } catch (error) {
      console.error(error);
      localStorage.removeItem(key);
    }
  };

  const setItem = (key: string, data: unknown) => {
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
