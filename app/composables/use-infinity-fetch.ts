import type { SearchParameters } from 'ofetch';
import type { AsyncDataRequestStatus } from '#app';

type Options = {
  query?: MaybeRefOrGetter<SearchParameters>;
};

export const useInfinityFetch = <T>(url: string, options: Options) => {
  const data = ref<T[]>([]);
  const page = ref(1);
  const status = ref<AsyncDataRequestStatus | 'end'>('idle');

  const fetchData = async () => {
    if (['pending', 'end'].includes(status.value)) return;

    status.value = 'pending';

    try {
      const response = await $fetch<T[]>(url, {
        method: 'GET',
        query: {
          ...toValue(options.query),
          page: page.value
        }
      });

      if (response.length === 0) {
        status.value = 'end';
        return;
      }

      data.value = [...data.value, ...response] as T[];
      page.value++;
    } finally {
      status.value = 'idle';
    }
  };

  const refresh = () => {
    page.value = 1;
    data.value = [];
    fetchData();
  };

  watch(
    () => toValue(options.query),
    () => refresh()
  );

  let observer: IntersectionObserver | null = null;

  onMounted(() => {
    fetchData();

    observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (entry && entry.isIntersecting) fetchData();
      },
      { rootMargin: '0px 0px 40px 0px' }
    );

    const target = document.querySelector('#infinity-fetch-trigger');

    if (target) observer.observe(target);
  });

  onBeforeUnmount(() => {
    if (observer) observer.disconnect();
  });

  return {
    data,
    status,
    refresh
  };
};
