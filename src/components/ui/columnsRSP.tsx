import type { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import EyeIcon from "../../assets/icons/EyeIcon";
import DeleteIcon from "../../assets/icons/DeleteIcon";
import EditIcon from "../../assets/icons/EditIcon";

export type RecentSalesPaid = {
  id: string;
  date: string;
  amount: number;
  actions?: {
    view?: boolean;
    delete?: boolean;
    edit?: boolean;
  };
};

// Columns Recent Sales Paid
export const columnsRSP: ColumnDef<RecentSalesPaid>[] = [
  {
    id: "rowNumber",
    header: () => <div className="text-center">No.</div>,
    cell: ({ row }) => {
      return <div className="text-center font-semibold">{row.index + 1}</div>;
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-center">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return (
        <div className="text-center font-semibold text-[#43A047]">
          +{formatted}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
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
              <EditIcon />
            </Button>
          )}

          {actions?.delete && (
            <Button variant="outline" size="icon" onClick={handleDescription}>
              <DeleteIcon />
            </Button>
          )}
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];
