export type OptionGroup<T> = { group?: string; list: T[] };

export const useFormOptions = <T extends Record<string, unknown> | string | number>(options: {
  options: MaybeRefOrGetter<T[] | undefined>;
  keyName?: MaybeRefOrGetter<keyof T | undefined>;
  keyValue?: MaybeRefOrGetter<keyof T | undefined>;
}) => {
  const getKeyValue = (option: T) => {
    const keyValue = toValue(options.keyValue);

    return keyValue && typeof option === 'object' ? (option[keyValue] as T) : option;
  };

  const getKeyName = (option: T) => {
    const keyName = toValue(options.keyName);

    return keyName && typeof option === 'object' ? option[keyName] : option;
  };

  const normalizedOptions = computed(() => {
    const list = toValue(options.options);

    if (!list?.length) return [] as OptionGroup<T>[];

    const hasGroup = list.some((option) => typeof option === 'object' && option.group);

    if (hasGroup) return list as unknown as OptionGroup<T>[];

    return [{ list }];
  });

  const allOptions = computed(() => normalizedOptions.value.flatMap((group) => group.list));

  const filterGroups = (query: string, predicate?: (option: T) => boolean, omitEmptyGroups = false) => {
    const normalizedQuery = query.toLowerCase();

    return normalizedOptions.value
      .map((optionGroup) => {
        const filteredList = optionGroup.list.filter((option) => {
          if (predicate && !predicate(option)) return false;

          if (!normalizedQuery) return true;

          return String(getKeyName(option)).toLowerCase().includes(normalizedQuery);
        });

        return { group: filteredList.length ? optionGroup.group : undefined, list: filteredList };
      })
      .filter((optionGroup) => (omitEmptyGroups ? optionGroup.list.length > 0 : true));
  };

  const hasGroupOptions = (groups: OptionGroup<T>[]) => groups.some((group) => group.list.length > 0);

  return { getKeyValue, getKeyName, normalizedOptions, allOptions, filterGroups, hasGroupOptions };
};
