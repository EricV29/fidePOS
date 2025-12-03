import type { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import EyeIcon from "@icons/EyeIcon";
import DeleteIcon from "@icons/DeleteIcon";
import EditIcon from "@icons/EditIcon";
import { partialNumberFilter } from "@utility/table-filter";
import { currencyFormat } from "@utility/currencyFormat";
import type { RecentSalesPaid } from "@typesm/sales";

// Columns Recent Sales Paid
export const columnsRSP: ColumnDef<RecentSalesPaid>[] = [
  {
    id: "rowNumber",
    header: "No",
    meta: {
      headerClassName: "text-center",
    },
    cell: ({ row }) => {
      return <div className="text-center font-semibold">{row.index + 1}</div>;
    },
  },
  {
    accessorKey: "created_at",
    header: "Created Date",
    meta: {
      headerClassName: "text-center",
    },
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue("created_at")}</div>;
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const category = row.getValue("category") as string;
      const ccolor = row.original.ccolor;
      return (
        <div style={{ background: ccolor }} className="categoryB">
          {category.toLocaleUpperCase()}
        </div>
      );
    },
  },
  {
    accessorKey: "total_amount",
    header: "Amount",
    cell: ({ row }) => {
      const formatted = currencyFormat(Number(row.getValue("total_amount")));

      return <div className="font-semibold text-[#43A047]">{formatted}</div>;
    },
    filterFn: partialNumberFilter,
  },
  {
    id: "actions",
    header: "Actions",
    meta: {
      headerClassName: "text-center",
    },
    cell: ({ row, table }) => {
      const actions = table.options.meta?.actions;

      const handleDescription = () => {
        console.log("ID:", row.original.id);
      };

      return (
        <div className="flex justify-center items-center space-x-2">
          {actions?.view && (
            <Button variant="outline" size="icon" onClick={handleDescription}>
              <EyeIcon />
            </Button>
          )}

          {actions?.edit && (
            <Button variant="outline" size="icon" onClick={handleDescription}>
              <EditIcon color="#F57C00" />
            </Button>
          )}

          {actions?.delete && (
            <Button variant="outline" size="icon" onClick={handleDescription}>
              <DeleteIcon color="#D32F2F" />
            </Button>
          )}
        </div>
      );
    },
  },
];
