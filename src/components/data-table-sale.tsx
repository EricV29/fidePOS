import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnFiltersState,
  getFilteredRowModel,
  getPaginationRowModel,
  type PaginationState,
} from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React, { useEffect, useState } from "react";
import SearchIcon from "@icons/SearchIcon";
import CustomSelect from "@components/Select";
import { useTranslation } from "react-i18next";

interface DataTableSaleProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  actions?: TableActions;
  addProduct?: (product: TData) => void;
  pagination: PaginationState;
  totalRows: number;
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
}

interface TableColumns {
  header: string;
  id: string;
  accessorKey?: string;
}

export interface TableActions {
  add?: boolean;
}

export function DataTableSale<TData, TValue>({
  columns,
  data,
  addProduct,
  pagination,
  setPagination,
  totalRows,
}: DataTableSaleProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [selectedColumn, setSelectedColumn] = useState("");
  const { t } = useTranslation();

  const table = useReactTable({
    data,
    columns,
    rowCount: totalRows,
    getCoreRowModel: getCoreRowModel(),
    meta: { addProduct },
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
      pagination,
    },
    manualPagination: true,
    onPaginationChange: setPagination,
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const columnOptions = (columns as TableColumns[])
    .filter((col) => col.accessorKey)
    .map((col) => ({
      label: typeof col.header === "string" ? col.header : col.id,
      value: col.accessorKey!,
    }));

  const currentColumn = selectedColumn || columnOptions[0]?.value;

  useEffect(() => {
    table.resetColumnFilters();
  }, [table, selectedColumn]);

  return (
    <div className="w-full h-full overflow-hidden flex flex-col gap-4">
      <div className="w-full flex justify-between gap-5">
        <div className="inputtext">
          <SearchIcon />
          <input
            placeholder={t("tableSearch.input_search")}
            value={
              (table.getColumn(currentColumn)?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn(currentColumn)?.setFilterValue(event.target.value)
            }
            className="w-full"
          />
        </div>
        <CustomSelect
          options={columnOptions}
          placeholder={t("tableSearch.input_select")}
          onChange={setSelectedColumn}
          color="#F57C00"
        />
      </div>

      <div className="h-full w-full overflow-auto">
        <Table>
          <TableHeader className="bg-[#FFEFDE] dark:bg-[#5f5f5f]">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={`font-semibold ${
                      header.column.columnDef.meta?.headerClassName ?? ""
                    }`}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  {t("global.no_data")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2">
        <button
          className="borange max-w-[100px]"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <p>{t("tableSearch.btn_previous")}</p>
        </button>
        <button
          className="borange max-w-[100px]"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <p>{t("tableSearch.btn_next")}</p>
        </button>
      </div>
    </div>
  );
}
