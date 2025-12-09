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

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  actions?: TableActions;
}

export interface TableActions {
  view?: boolean;
  edit?: boolean;
  delete?: boolean;
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
    meta: { actions },
  });

  // Detectar columnas numéricas y sumar valores
  const numericTotals: Record<string, number> = {};

  columns.forEach((col) => {
    const key = col.accessorKey as string;

    // Solo columnas con accessor y números
    if (key && typeof (data[0] as any)?.[key] === "number") {
      numericTotals[key] = data.reduce(
        (sum, row) => sum + (row as any)[key],
        0
      );
    }
  });

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

            <TableRow className="sticky bottom-0 bg-[#FFF8ED] font-semibold">
              {table.getVisibleFlatColumns().map((column, index) => {
                const key = column.id;

                return (
                  <TableCell key={key}>
                    {numericTotals[key] !== undefined
                      ? currencyFormat(numericTotals[key])
                      : index === 0
                      ? "Totals"
                      : ""}
                  </TableCell>
                );
              })}
            </TableRow>
          </>
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="text-center">
              There is no data yet.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
