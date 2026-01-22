import type { ColumnDef } from "@tanstack/react-table";
import { currencyFormat } from "@utility/currencyFormat";
import { partialNumberFilter } from "@utility/table-filter";
import type { AccountsReceivable } from "@typesm/accounts";
import type { TFunction } from "i18next";
import { formatDateColumns } from "@utility/dateFormats";
import { RowActions } from "@components/RowActions";

// Columns Accounts Receivable
export const columnsAR = (
  t: TFunction,
  language: string,
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

      return <RowActions row={row.original} actions={actions} />;
    },
  },
];
