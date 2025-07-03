// @ts-ignore: Import from main project
import dictionary from '/assets/dictionary.json';

export const useDictionary = (key: string) => {
  const list: Record<string, string> = dictionary;

  if (key in list) return list[key];

  return key;
};
