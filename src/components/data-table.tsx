import {
  flexRender,
  getCoreRowModel,
  useReactTable,
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
import { currencyFormat } from "@utility/currencyFormat";
import { useTranslation } from "react-i18next";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  actions?: {
    onView?: (row: TData) => void;
    onEdit?: (row: TData) => void;
    onDelete?: (row: TData) => void;
    onAdd?: (row: TData) => void;
  };
}

export function DataTable<TData, TValue>({
  columns,
  data,
  actions,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      actions,
    },
  });

  const { t } = useTranslation();
  const numericTotals: Record<string, number> = {};
  columns.forEach((col) => {
    if (!("accessorKey" in col)) return;

    const key = col.accessorKey;

    if (typeof key !== "string") return;

    const excluded = ["stock", "sale_num", "debts_number"];

    if (
      !excluded.includes(key) &&
      typeof (data[0] as Record<string, unknown>)?.[key] === "number"
    ) {
      numericTotals[key] = data.reduce(
        (sum, row) => sum + (row as Record<string, number>)[key],
        0,
      );
    }
  });

  return (
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
          <>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}

            <TableRow className="sticky bottom-0 bg-[#FFF8ED] dark:bg-[#5f5f5f] dark:text-[#b3b3b3] font-semibold">
              {table.getVisibleFlatColumns().map((column, index) => {
                const key = column.id;

                return (
                  <TableCell key={key}>
                    {numericTotals[key] !== undefined
                      ? currencyFormat(numericTotals[key])
                      : index === 0
                        ? t("charts.totals")
                        : ""}
                  </TableCell>
                );
              })}
            </TableRow>
          </>
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="text-center">
              {t("global.no_data")}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
