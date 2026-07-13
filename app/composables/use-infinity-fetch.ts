import type { SearchParameters } from 'ofetch';
import type { AsyncDataRequestStatus } from '#app';
import type { ShallowRef } from 'vue';

type Options = {
  el: Readonly<ShallowRef<HTMLElement | null>>;
  container?: 'parent' | 'window';
  dataKey?: string;
  method?: 'GET' | 'POST';
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
      method: options.method || 'GET',
      [options.method === 'POST' ? 'body' : 'query']: {
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

  const isNearBottom = (target: HTMLElement, container: HTMLElement | Window) => {
    const targetBottom = target.getBoundingClientRect().bottom;
    const visibleBottom =
      container instanceof Window ? container.innerHeight : container.getBoundingClientRect().bottom;

    return targetBottom <= visibleBottom;
  };

  onMounted(() => {
    fetchData();

    const target = unref(options.el);
    if (!target) return;

    const container = options.container === 'parent' ? target.parentElement : window;
    const scrollTarget = container ?? window;

    const onScroll = () => {
      if (isNearBottom(target, scrollTarget)) fetchData();
    };

    scrollTarget.addEventListener('scroll', onScroll, { passive: true });

    onUnmounted(() => scrollTarget.removeEventListener('scroll', onScroll));
  });

  return {
    data,
    status,
    refresh,
    currentPage: page
  };
};
