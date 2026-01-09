import type { Cell, Header } from '@tanstack/vue-table';

export const getMetaClass = <TData, TValue>(
  metaClass:
    | string
    | ((arg: Cell<TData, TValue>) => string | undefined)
    | ((arg: Header<TData, TValue>) => string | undefined)
    | undefined,
  arg: Cell<TData, TValue> | Header<TData, TValue>
) => {
  if (typeof metaClass === 'function') return metaClass(arg as Cell<TData, TValue> & Header<TData, TValue>);

  return metaClass;
};
