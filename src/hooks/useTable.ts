import { type ReactNode, useCallback } from "react";

// --- Types (compatible with @tanstack/react-table surface) ---

export interface ColumnMeta {
  headerClassName?: string;
}

export interface ColumnDef<TData = unknown, _TValue = unknown> {
  id?: string;
  accessorKey?: string;
  accessorFn?: (row: TData) => unknown;
  header?: string | ((ctx: HeaderContext<TData>) => ReactNode);
  cell?: (ctx: CellContext<TData>) => ReactNode;
  meta?: ColumnMeta;
  filterFn?: unknown;
}

export interface ColumnInstance<TData = unknown> {
  id: string;
  columnDef: ColumnDef<TData>;
}

export interface TableMeta<TData = unknown> {
  actions?: {
    onView?: (row: TData) => void;
    onEdit?: (row: TData) => void;
    onDelete?: (row: TData) => void;
    onAdd?: (row: TData) => void;
    onActive?: (row: TData) => void;
  };
  updateData?: (rowIndex: number, columnId: string, value: unknown) => void;
  addProduct?: (product: TData) => void;
  deleteProduct?: (id: string) => void;
}

export interface PaginationState {
  pageIndex: number;
  pageSize: number;
}

export type ColumnFiltersState = Array<{ id: string; value: unknown }>;

export interface RowContext<TData = unknown> {
  original: TData;
  index: number;
  getValue: (columnId: string) => any;
}

export interface HeaderContext<TData = unknown> {
  column: ColumnInstance<TData>;
  table: { options: { meta?: TableMeta<TData> } };
}

export interface CellContext<TData = unknown> {
  row: RowContext<TData>;
  column: ColumnInstance<TData>;
  table: { options: { meta?: TableMeta<TData> } };
  getValue: () => any;
}

export interface HeaderDef<TData = unknown> {
  id: string;
  column: ColumnInstance<TData>;
  getContext: () => HeaderContext<TData>;
}

export interface HeaderGroup<TData = unknown> {
  id: string;
  headers: HeaderDef<TData>[];
}

export interface CellDef<TData = unknown> {
  id: string;
  column: ColumnInstance<TData>;
  getContext: () => CellContext<TData>;
}

export interface RowDef<TData = unknown> {
  id: string;
  original: TData;
  getVisibleCells: () => CellDef<TData>[];
}

export interface RowModel<TData = unknown> {
  rows: RowDef<TData>[];
}

// --- helpers ---

export function flexRender(renderable: unknown, context: unknown): ReactNode {
  if (typeof renderable === "function") {
    return (renderable as (ctx: unknown) => ReactNode)(context);
  }
  return renderable as ReactNode;
}

// --- useTable hook ---

interface TableOptions<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  meta?: TableMeta<TData>;
  rowCount?: number;
  pageCount?: number;
  manualPagination?: boolean;
  manualFiltering?: boolean;
  state?: { pagination?: PaginationState; columnFilters?: ColumnFiltersState };
  onPaginationChange?: (updater: PaginationState | ((prev: PaginationState) => PaginationState)) => void;
  onColumnFiltersChange?: (updater: ColumnFiltersState | ((prev: ColumnFiltersState) => ColumnFiltersState)) => void;
  getCoreRowModel?: () => unknown;
  getFilteredRowModel?: () => unknown;
  getPaginationRowModel?: () => unknown;
  initialState?: { pagination?: { pageSize?: number } };
}

interface TableInstance<TData> {
  getHeaderGroups: () => HeaderGroup<TData>[];
  getRowModel: () => RowModel<TData>;
  getVisibleFlatColumns: () => ColumnInstance<TData>[];
  previousPage: () => void;
  nextPage: () => void;
  getCanPreviousPage: () => boolean;
  getCanNextPage: () => boolean;
}

function getValueFromItem<TData>(item: TData, accessorKey?: string): any {
  if (!accessorKey) return undefined;
  return (item as Record<string, any>)[accessorKey];
}

export function getColumnId(col: ColumnDef<any, any>): string {
  return col.id ?? col.accessorKey ?? "";
}

export function useTable<TData>(options: TableOptions<TData>): TableInstance<TData> {
  const { data, columns: rawColumns, meta, rowCount: totalRows, state, onPaginationChange } = options;
  const columns = rawColumns as ColumnDef<TData>[];
  const pagination = state?.pagination;

  const getHeaderGroups = useCallback((): HeaderGroup<TData>[] => {
    return [
      {
        id: "0",
        headers: columns.map((col) => {
          const id = getColumnId(col);
          return {
            id,
            column: { id, columnDef: col as ColumnDef<TData> },
            getContext: () => ({
              column: { id, columnDef: col as ColumnDef<TData> },
              table: { options: { meta } },
            }),
          };
        }),
      },
    ];
  }, [columns, meta]);

  const getRowModel = useCallback((): RowModel<TData> => {
    return {
      rows: data.map((item, index) => ({
        id: String(index),
        original: item,
        getVisibleCells: () =>
          columns.map((col) => {
            const id = getColumnId(col);
            return {
              id: `${index}:${id}`,
              column: { id, columnDef: col as ColumnDef<TData> },
              getContext: () => ({
                row: {
                  original: item,
                  index,
                  getValue: (columnId: string) => {
                    const found = columns.find(
                      (c) => getColumnId(c) === columnId,
                    );
                    return getValueFromItem(item, found?.accessorKey);
                  },
                },
                column: { id, columnDef: col as ColumnDef<TData> },
                table: { options: { meta } },
                getValue: () => getValueFromItem(item, col.accessorKey),
              }),
            };
          }),
      })),
    };
  }, [data, columns, meta]);

  const getVisibleFlatColumns = useCallback((): ColumnInstance<TData>[] => {
    return columns.map((col) => {
      const id = getColumnId(col);
      return { id, columnDef: col as ColumnDef<TData> };
    });
  }, [columns]);

  const previousPage = useCallback(() => {
    if (!onPaginationChange || !pagination) return;
    onPaginationChange({
      pageIndex: pagination.pageIndex - 1,
      pageSize: pagination.pageSize,
    });
  }, [onPaginationChange, pagination]);

  const nextPage = useCallback(() => {
    if (!onPaginationChange || !pagination) return;
    onPaginationChange({
      pageIndex: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
    });
  }, [onPaginationChange, pagination]);

  const getCanPreviousPage = useCallback((): boolean => {
    return pagination ? pagination.pageIndex > 0 : false;
  }, [pagination]);

  const getCanNextPage = useCallback((): boolean => {
    if (!pagination) return false;
    if (totalRows != null) {
      return (pagination.pageIndex + 1) * pagination.pageSize < totalRows;
    }
    return false;
  }, [pagination, totalRows]);

  return {
    getHeaderGroups,
    getRowModel,
    getVisibleFlatColumns,
    previousPage,
    nextPage,
    getCanPreviousPage,
    getCanNextPage,
  };
}
