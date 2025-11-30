import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import EyeIcon from "../../assets/icons/EyeIcon";
import DeleteIcon from "../../assets/icons/DeleteIcon";
import EditIcon from "../../assets/icons/EditIcon";
import { currencyFormat } from "@/utility/currencyFormat";
import { partialNumberFilter } from "@/utility/table-filter";

export type AccountsReceivable = {
  id: string;
  created_at: string;
  total_amount: number;
  paid_amount: number;
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
    accessorKey: "total_amount",
    header: "Total Amount",
    cell: ({ row }) => {
      const formatted = currencyFormat(Number(row.getValue("total_amount")));

      return <div className="font-semibold text-[#F57C00]">{formatted}</div>;
    },
    filterFn: partialNumberFilter,
  },
  {
    accessorKey: "paid_amount",
    header: "Paid Amount",
    cell: ({ row }) => {
      const formatted = currencyFormat(Number(row.getValue("paid_amount")));

      return <div className="font-semibold text-[#43A047]">+{formatted}</div>;
    },
    filterFn: partialNumberFilter,
  },
  {
    accessorKey: "debtPending",
    header: "Debt Pending",
    cell: ({ row }) => {
      const formatted = currencyFormat(Number(row.getValue("paid_amount")));

      return <div className="font-semibold text-[#D32F2F]">-{formatted}</div>;
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
