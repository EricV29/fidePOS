import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@components/ui/button";
import EyeIcon from "@icons/EyeIcon";
import DeleteIcon from "@icons/DeleteIcon";
import EditIcon from "@icons/EditIcon";
import { currencyFormat } from "@utility/currencyFormat";
import { partialNumberFilter } from "@utility/table-filter";
import type { AccountsReceivable } from "@typesm/accounts";

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
    accessorKey: "customer",
    header: "Customer",
    cell: ({ row }) => {
      return `${row.original.name} ${row.original.last_name}`;
    },
    accessorFn: (row) => `${row.name} ${row.last_name}`,
  },
  {
    accessorKey: "code_sku",
    header: "Code SKU",
  },
  {
    accessorKey: "debt_amount",
    header: "Debt Amount",
    cell: ({ row }) => {
      const formatted = currencyFormat(Number(row.getValue("debt_amount")));

      return <div className="font-semibold text-[#F57C00]">{formatted}</div>;
    },
    filterFn: partialNumberFilter,
  },
  {
    accessorKey: "debt_paid",
    header: "Debt Paid",
    cell: ({ row }) => {
      const formatted = currencyFormat(Number(row.getValue("debt_paid")));

      return <div className="font-semibold text-[#43A047]">+{formatted}</div>;
    },
    filterFn: partialNumberFilter,
  },
  {
    accessorKey: "debt_pending",
    header: "Debt Pending",
    cell: ({ row }) => {
      const formatted = currencyFormat(Number(row.getValue("debt_pending")));

      return <div className="font-semibold text-[#D32F2F]">-{formatted}</div>;
    },
    filterFn: partialNumberFilter,
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
