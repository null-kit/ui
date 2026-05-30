export type { ColumnHelper, ColumnDef } from '@tanstack/vue-table';

export type TableSortType = `${string}:${'asc' | 'desc'}` | undefined;

type TSlot<T> = {
  [K in Extract<keyof T, string>]?: (props: { row: T; cell: NoInfer<T[K]>; isNested: boolean }) => void;
} & {
  [key: string]: (props: { row: T; cell: NoInfer<T[K]>; isNested: boolean }) => void;
};

type TSortDir = 'asc' | 'desc' | boolean;

type TSort<T> = {
  sort?: (props: { dir: TSortDir }) => void;
} & {
  [K in `sort-${keyof T}`]?: (props: { dir: TSortDir }) => void;
};

type TValues<T> = {
  values: T[keyof T][];
  getValues: <TValue extends T[keyof T]>(column: keyof T) => TValue[];
};

type THead<T> = {
  [K in `th-${Extract<keyof T, string>}`]?: (props: TValues<T>) => void;
} & {
  [K in `th-${Extract<keyof T, string>}-${'left' | 'right'}`]?: (props: TValues<T>) => void;
};

type TFoot<T> = {
  [K in `tf-${Extract<keyof T, string>}`]?: (props: TValues<T>) => void;
};

export type TableSlots<T> = TSlot<T> & TSort<T> & THead<T> & TFoot<T>;
