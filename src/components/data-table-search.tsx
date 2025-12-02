import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnFiltersState,
  getFilteredRowModel,
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
import SearchIcon from "@/assets/icons/SearchIcon";
import CustomSelect from "./Select";

interface DataTableSearchProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  actions?: TableActions;
}

interface TableColumns {
  header: string;
  id: string;
  accessorKey?: string;
}

export interface TableActions {
  view?: boolean;
  edit?: boolean;
  delete?: boolean;
}

export function DataTableSearch<TData, TValue>({
  columns,
  data,
  actions,
}: DataTableSearchProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [selectedColumn, setSelectedColumn] = useState("");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: { actions },
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
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
    <>
      <div className="w-full flex justify-between gap-5">
        <div className="inputtext">
          <SearchIcon />
          <input
            placeholder="Search register..."
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
          placeholder="Choose"
          onChange={setSelectedColumn}
        />
      </div>
      <Table>
        <TableHeader className="bg-[#FFEFDE] sticky top-0">
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
                    header.getContext()
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
                There is no data yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
