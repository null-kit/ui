export type { ColumnHelper, ColumnDef } from '@tanstack/vue-table';

// TanStack Table Slots
export type TableSortType = `${string}:${'asc' | 'desc'}` | undefined;

export type TableDataSlots<TData> = {
  [TValue in Extract<keyof TData, string>]?: (props: {
    row: TData;
    cell: NoInfer<TData[TValue]>;
    isNested: boolean;
  }) => void;
} & {
  [key: string]: (props: { row: TData; cell: NoInfer<TData[TValue]>; isNested: boolean }) => void;
};

export type TableSortDirection = 'asc' | 'desc' | boolean;

export type TableSortSlots<TData> = {
  sort?: (props: { dir: TableSortDirection }) => void;
} & {
  [K in `sort-${keyof TData}`]?: (props: { dir: TableSortDirection }) => void;
};

type TableHeadSlotProps<TData> = {
  values: TData[keyof TData][];
  getValues: <T extends TData[keyof TData][]>(column: keyof TData) => T;
};

export type TableHeadSlots<TData> = {
  [K in `th-${Extract<keyof TData, string>}`]?: (props: TableHeadSlotProps<TData>) => void;
} & {
  [K in `th-${Extract<keyof TData, string>}-${'left' | 'right'}`]?: (props: TableHeadSlotProps<TData>) => void;
};

export type TableSlots<TData> = TableDataSlots<TData> & TableSortSlots<TData> & TableHeadSlots<TData>;
