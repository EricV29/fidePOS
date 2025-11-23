import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import EyeIcon from "../../assets/icons/EyeIcon";
import DeleteIcon from "../../assets/icons/DeleteIcon";
import EditIcon from "../../assets/icons/EditIcon";

export type AccountsReceivable = {
  id: string;
  date: string;
  totalAmount: number;
  paidAmount: number;
  debtPending: number;
  actions?: {
    view?: boolean;
    delete?: boolean;
    edit?: boolean;
  };
};

// Columns Accounts Receivable
export const columnsAR: ColumnDef<AccountsReceivable>[] = [
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
    accessorKey: "totalAmount",
    header: () => <div className="text-center">Total Amount</div>,
    cell: ({ row }) => {
      const totalAmount = parseFloat(row.getValue("totalAmount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(totalAmount);

      return (
        <div className="text-center font-semibold text-[#F57C00]">
          {formatted}
        </div>
      );
    },
  },
  {
    accessorKey: "paidAmount",
    header: () => <div className="text-center">Paid Amount</div>,
    cell: ({ row }) => {
      const paidAmount = parseFloat(row.getValue("paidAmount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(paidAmount);

      return (
        <div className="text-center font-semibold text-[#43A047]">
          +{formatted}
        </div>
      );
    },
  },
  {
    accessorKey: "debtPending",
    header: () => <div className="text-center">Debt Pending</div>,
    cell: ({ row }) => {
      const debtPending = parseFloat(row.getValue("debtPending"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(debtPending);

      return (
        <div className="text-center font-semibold text-[#D32F2F]">
          -{formatted}
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
    enableSorting: false,
    enableHiding: false,
  },
];
