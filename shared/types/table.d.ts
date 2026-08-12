import type {
  Cell,
  CellContext,
  CellData,
  Column,
  ColumnDef as TanstackColumnDef,
  ColumnHelper as TanstackColumnHelper,
  Header,
  Row,
  RowData,
  Table,
  TableFeatures
} from '@tanstack/vue-table';
import type { TableFeatureSet } from '../utils/table-features';

export type { RowData };

export type ColumnDef<T extends RowData> = TanstackColumnDef<TableFeatureSet, T>;
export type ColumnHelper<T extends RowData> = TanstackColumnHelper<TableFeatureSet, T>;
export type TableInstance<T extends RowData> = Table<TableFeatureSet, T>;
export type TableColumn<T extends RowData, TValue = unknown> = Column<TableFeatureSet, T, TValue>;
export type TableHeader<T extends RowData> = Header<TableFeatureSet, T, CellData>;
export type TableRow<T extends RowData> = Row<TableFeatureSet, T>;
export type TableCell<T extends RowData, TValue extends CellData = CellData> = Cell<TableFeatureSet, T, TValue>;
export type TableTdClass<T extends RowData, TValue extends CellData = CellData> = TdClass<TableFeatureSet, T, TValue>;

type TdClass<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData> =
  string | ((context: CellContext<TFeatures, TData, TValue>) => string | undefined);

declare module '@tanstack/vue-table' {
  interface ColumnMeta<
    in out TFeatures extends TableFeatures,
    in out TData extends RowData,
    TValue extends CellData = CellData
  > {
    class?: string;
    thClass?: string;
    tdClass?: TdClass<TFeatures, TData, TValue>;
    tfClass?: string;
    show?: boolean;
    pin?: 'start' | 'end';
  }
}

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
