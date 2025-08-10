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
  virtual?: boolean;
};

export type TableDataSlots<T> = {
  [K in keyof T]?: (props: { entry: T; value: T[K]; values: T[] }) => void;
};

export type TableExtraSlots<T> = {
  [key: string]: (props: { entry: T; value: T[keyof T]; values: T[] }) => void;
};

export type TableSlots<T> = TableDataSlots<T> & TableExtraSlots<T>;
