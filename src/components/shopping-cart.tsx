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
import { useTranslation } from "react-i18next";

interface ShoppingCartProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  actions?: TableActions;
  updateData?: (rowIndex: number, columnId: string, value: unknown) => void;
  deleteProduct?: (id: string) => void;
}

export interface TableActions {
  view?: boolean;
  edit?: boolean;
  delete?: boolean;
}

export function ShoppingCart<TData, TValue>({
  columns,
  data,
  actions,
  updateData,
  deleteProduct,
}: ShoppingCartProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      actions,
      updateData,
      deleteProduct,
    },
  });

  const { t } = useTranslation();

  return (
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
              {t("global.no_data")}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
