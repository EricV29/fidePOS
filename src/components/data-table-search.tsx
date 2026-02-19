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

interface DataTableSearchProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  actions?: {
    onView?: (row: TData) => void;
    onEdit?: (row: TData) => void;
    onDelete?: (row: TData) => void;
    onAdd?: (row: TData) => void;
  };
  pagination: PaginationState;
  totalRows: number;
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
}

interface TableColumns {
  header: string;
  id: string;
  accessorKey?: string;
}

export function DataTableSearch<TData, TValue>({
  columns,
  data,
  actions,
  pagination,
  setPagination,
  totalRows,
}: DataTableSearchProps<TData, TValue>) {
  const { t } = useTranslation();
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [selectedColumn, setSelectedColumn] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<TData[]>(data);

  const table = useReactTable({
    data: products,
    columns,
    rowCount: totalRows,
    getCoreRowModel: getCoreRowModel(),
    meta: { actions },
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    manualFiltering: true,
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
    setProducts(data);
  }, [data]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setProducts(data);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      let searchText = searchTerm;

      if (currentColumn === "unit_price") {
        searchText = searchTerm.replace(/[$,]/g, "");
      }
      const data = {
        column: currentColumn,
        text: searchText,
      };

      const response = await window.electronAPI.getFilterSearchProducts(data);

      if (response.success && response.result) {
        setProducts(response.result);
      } else {
        console.error("Error en la base de datos:", response.error);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [currentColumn, data, searchTerm]);

  return (
    <>
      <div className="w-full h-full overflow-hidden flex flex-col gap-4">
        <div className="w-full flex justify-between gap-5 ">
          <div className="inputtext">
            <SearchIcon />
            <input
              placeholder={t("tableSearch.input_search")}
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
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
            <TableHeader className="bg-[#FFEFDE] dark:bg-[#5f5f5f] sticky top-0">
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

            <TableBody className="dark:text-[#b3b3b3]">
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
            <span>{t("tableSearch.btn_previous")}</span>
          </button>
          <button
            className="borange max-w-[100px]"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span>{t("tableSearch.btn_next")}</span>
          </button>
        </div>
      </div>
    </>
  );
}
