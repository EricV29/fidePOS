import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@components/ui/button";
import PreviewIcon from "@/assets/icons/PreviewIcon";
import DeleteIcon from "@icons/DeleteIcon";
import EditIcon from "@icons/EditIcon";
import { currencyFormat } from "@utility/currencyFormat";
import { partialNumberFilter } from "@utility/table-filter";
import type { AccountsReceivable } from "@typesm/accounts";
import type { TFunction } from "i18next";
import { formatDateColumns } from "@utility/dateFormatColumns";

// Columns Accounts Receivable
export const columnsAR = (
  t: TFunction,
  language: string
): ColumnDef<AccountsReceivable>[] => [
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
    header: t("columns.customer"),
    cell: ({ row }) => {
      return `${row.original.name} ${row.original.last_name}`;
    },
    accessorFn: (row) => `${row.name} ${row.last_name}`,
  },
  {
    accessorKey: "code_sku",
    header: t("columns.code"),
  },
  {
    accessorKey: "debt_amount",
    header: t("columns.debt_amount"),
    cell: ({ row }) => {
      const formatted = currencyFormat(Number(row.getValue("debt_amount")));

      return <div className="font-semibold text-[#F57C00]">{formatted}</div>;
    },
    filterFn: partialNumberFilter,
  },
  {
    accessorKey: "debt_paid",
    header: t("columns.debt_paid"),
    cell: ({ row }) => {
      const formatted = currencyFormat(Number(row.getValue("debt_paid")));

      return <div className="font-semibold text-[#43A047]">+{formatted}</div>;
    },
    filterFn: partialNumberFilter,
  },
  {
    accessorKey: "debt_pending",
    header: t("columns.debt_pending"),
    cell: ({ row }) => {
      const formatted = currencyFormat(Number(row.getValue("debt_pending")));

      return <div className="font-semibold text-[#D32F2F]">-{formatted}</div>;
    },
    filterFn: partialNumberFilter,
  },
  {
    accessorKey: "created_at",
    header: t("columns.created_at"),
    meta: {
      headerClassName: "text-center",
    },
    cell: ({ row }) => {
      return (
        <div className="text-center">
          {formatDateColumns(row.getValue("created_at"), language)}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: t("columns.actions"),
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
              <PreviewIcon />
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
