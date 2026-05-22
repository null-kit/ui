export type { ColumnHelper, ColumnDef } from '@tanstack/vue-table';

export type TableProps<T> = {
  data: T[];

  stickyHead?: boolean;
  stickyOffset?: string;
  stickyLeft?: string[];
  stickyRight?: string[];

  sortBy?: string[];
  sortByClient?: string[];

  trClass?: string;
  thClass?: string;
  tdClass?: string;

  omit?: (keyof T)[];
  pick?: (keyof T)[];
  columnsExtra?: string[];

  dictionaryKey?: string;
  expandedKey?: string;
  virtualScroll?: boolean;
};

// TanStack Table Slots
export type TableSortType = `${Extract<keyof TData, string>}:${'asc' | 'desc'}` | undefined;

export type TableDataSlots<TData> = {
  [TValue in keyof TData]?: (props: { row: TData; cell: NoInfer<TData[TValue]>; isNested: boolean }) => void;
};

export type TableSortDirection = 'asc' | 'desc' | boolean;

export type TableSortSlots<TData> = {
  sort?: (props: { dir: TableSortDirection }) => void;
} & {
  [K in `sort-${Extract<keyof TData, string>}`]?: (props: { dir: TableSortDirection }) => void;
};

export type TableHeadSlotProps<TData> = {
  values: TData[keyof TData][];
  getValues: <T>(column: string) => T;
};

export type TableHeadSlots<TData> = {
  [K in `th-${Extract<keyof TData, string>}`]?: (props: TableHeadSlotProps<TData>) => void;
} & {
  [K in `th-${Extract<keyof TData, string>}-${'left' | 'right'}`]?: (props: TableHeadSlotProps<TData>) => void;
};

export type TableExtraSlots<TData> = {
  [key: string]: (props: {
    row: TData;
    cell: TData[keyof TData];
    values: (number | string)[];
    isNested: boolean;
  }) => void;
};

export type TableSlots<TData> = TableDataSlots<TData> &
  TableSortSlots<TData> &
  TableHeadSlots<TData> &
  TableExtraSlots<TData>;
