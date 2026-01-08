import type { SearchParameters } from 'ofetch';
import type { AsyncDataRequestStatus } from '#app';

type Options = {
  dataKey?: string;
  query?: MaybeRefOrGetter<SearchParameters>;
};

export const useInfinityFetch = <T>(url: string, options: Options) => {
  const data = ref<T[]>([]);
  const page = ref(1);
  const status = ref<AsyncDataRequestStatus | 'end'>('idle');

  const query = computed(() => toValue(options.query));

  const fetchData = async () => {
    if (['pending', 'end'].includes(status.value)) return;

    status.value = 'pending';

    const response = await $fetch<T[]>(url, {
      method: 'GET',
      query: {
        ...query.value,
        page: page.value
      }
    });

    const responseData = (options.dataKey ? response[options.dataKey as keyof typeof response] : response) as T[];

    if (responseData && responseData.length === 0) {
      status.value = 'end';
      return;
    }

    data.value = [...data.value, ...responseData] as T[];
    page.value++;

    status.value = 'idle';
  };

  const refresh = () => {
    page.value = 1;
    data.value = [];
    status.value = 'idle';
    fetchData();
  };

  watch(query, () => refresh());

  let observer: IntersectionObserver | null = null;

  onMounted(() => {
    fetchData();

    observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (entry && entry.isIntersecting) fetchData();
      },
      { rootMargin: '0px 0px 0px 0px' }
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
    refresh,
    currentPage: page
  };
};
