import type { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import EyeIcon from "../../assets/icons/EyeIcon";
import DeleteIcon from "../../assets/icons/DeleteIcon";
import EditIcon from "../../assets/icons/EditIcon";

export type RecentSalesPaid = {
  id: string;
  created_at: string;
  category: string;
  ccolor: string;
  total_amount: number;
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
    accessorKey: "created_at",
    header: () => <div className="text-center">Date</div>,
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue("created_at")}</div>;
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const ccolor = row.original.ccolor;
      return (
        <div
          style={{ background: ccolor }}
          className="rounded-full px-1 text-center font-semibold"
        >
          {row.getValue("category")}
        </div>
      );
    },
  },
  {
    accessorKey: "total_amount",
    header: () => <div className="text-center">Amount</div>,
    cell: ({ row }) => {
      const total_amount = parseFloat(row.getValue("total_amount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(total_amount);

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
