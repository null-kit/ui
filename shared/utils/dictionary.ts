// @ts-expect-error: Import from main project
import dictionary from '/assets/dictionary.json';

export const useDictionary = (key: string) => {
  const list: Record<string, string> = dictionary;

  if (!list) return key;

  if (key in list) return list[key];

  const keys = key.split('.');
  const group = keys[0];
  const groupKey = keys[1];

  if (!group || !groupKey || typeof list[group] !== 'object') return key;

  if (groupKey in list[group]) return list[group][groupKey];

  if (groupKey && groupKey in list) return list[groupKey];

  return key;
};
