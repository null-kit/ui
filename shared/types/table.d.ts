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

export type TableDataSlots<T> = {
  [K in keyof T]?: (props: { entry: T; value: T[K]; values: T[]; isNested: boolean }) => void;
};

export type TableExtraSlots<T> = {
  [key: string]: (props: { entry: T; value: T[keyof T]; values: T[]; isNested: boolean }) => void;
};

export type TableSlots<T> = TableDataSlots<T> & TableExtraSlots<T>;

// TanStack Table Slots
export type TableTanDataSlots<TData> = {
  [TValue in keyof TData]?: (props: { row: TData; cell: NoInfer<TData[TValue]>; isNested: boolean }) => void;
};

export type TableTanExtraSlots<TData> = {
  [key: string]: (props: { row: TData; cell: TData[keyof TData]; isNested: boolean }) => void;
};

export type TableTanSlots<TData> = TableTanDataSlots<TData> & TableTanExtraSlots<TData>;
