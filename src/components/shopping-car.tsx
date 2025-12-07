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

interface ShoppingCarProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  actions?: TableActions;
  updateData?: (rowIndex: number, columnId: string, value: any) => void;
  deleteProduct?: (id: string) => void;
}

export interface TableActions {
  view?: boolean;
  edit?: boolean;
  delete?: boolean;
}

export function ShoppingCar<TData, TValue>({
  columns,
  data,
  actions,
  updateData,
  deleteProduct,
}: ShoppingCarProps<TData, TValue>) {
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
              No products in the cart yet.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
