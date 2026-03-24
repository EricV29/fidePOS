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
  page: string;
  actions?: {
    onView?: (row: TData) => void;
    onEdit?: (row: TData) => void;
    onDelete?: (row: TData) => void;
    onAdd?: (row: TData) => void;
    onActive?: (row: TData) => void;
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
  page,
  actions,
  pagination,
  setPagination,
  totalRows,
}: DataTableSearchProps<TData, TValue>) {
  const { t, i18n } = useTranslation();
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [selectedColumn, setSelectedColumn] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<TData[]>(data);
  const language = i18n.language;

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
    const status: Record<string, string> = {
      activo: "active",
      inactivo: "inactive",
      "en deuda": "debt",
      pagado: "paid",
      "no pagado": "unpaid",
    };

    if (!searchTerm.trim()) {
      setProducts(data);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      let searchText = searchTerm;

      if (currentColumn === "unit_price") {
        searchText = searchTerm.replace(/[$,]/g, "");
      }

      if (currentColumn === "status" && i18n.language === "es") {
        const normalizedSearch = searchTerm.toLowerCase().trim();

        const keyFound = Object.keys(status).find((key) =>
          key.toLowerCase().includes(normalizedSearch),
        );

        searchText = keyFound ? status[keyFound] : "not_found";
      }

      if (currentColumn === "created_at" || currentColumn === "deleted_at") {
        const cleanTerm = searchTerm.replace(/[^0-9/,-]/g, "");
        const parts = cleanTerm.split(/[/-]/);

        if (parts.length >= 2) {
          const isSpanish = language.startsWith("es");

          // Si es ES: [DD, MM, YYYY] -> DB quiere [YYYY, MM, DD]
          // Si es US: [MM, DD, YYYY] -> DB quiere [YYYY, MM, DD]

          const day = isSpanish ? parts[0] : parts[1];
          const month = isSpanish ? parts[1] : parts[0];
          const year = parts[2] || "";

          if (year) {
            searchText = `${year}-${month}-${day}`;
          } else {
            searchText = `-${month}-${day}`;
          }
        } else {
          searchText = searchTerm;
        }
      }

      const data = {
        column: currentColumn,
        text: searchText,
      };

      let response = { success: false, result: [] as TData[], error: "" };

      if (page === "products") {
        response = (await window.electronAPI.getFilterSearchProducts(
          data,
        )) as typeof response;
      } else if (page === "history") {
        response = (await window.electronAPI.getFilterSearchHistorySales(
          data,
        )) as typeof response;
      } else if (page === "customersGeneral") {
        response = (await window.electronAPI.getFilterSearchCustomers(
          data,
        )) as typeof response;
      } else if (page === "customersPaymentsDebts") {
        response = (await window.electronAPI.getFilterSearchCustomersDebts(
          data,
        )) as typeof response;
      } else if (page === "customersPaymentsPayments") {
        response = (await window.electronAPI.getFilterSearchCustomersPayments(
          data,
        )) as typeof response;
      } else if (page === "settingsUsers") {
        response = (await window.electronAPI.getFilterSearchUsers(
          data,
        )) as typeof response;
      } else if (page === "settingsCategories") {
        response = (await window.electronAPI.getFilterSearchCategories(
          data,
        )) as typeof response;
      }

      if (response.success && response.result) {
        setProducts(response.result);
      } else {
        console.error("Error en la base de datos:", response.error);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [currentColumn, data, searchTerm, language, page, i18n.language]);

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
