import type { ColumnDef } from "@tanstack/react-table";
import { partialNumberFilter } from "@utility/table-filter";
import { currencyFormat } from "@utility/currencyFormat";
import type { Customers } from "@typesm/customers";
import type { TFunction } from "i18next";
import { formatDateColumns } from "@utility/dateFormats";
import { getStatusConfig } from "@utility/statusColumns";
import { RowActions } from "@components/RowActions";

// Columns Customers
export const columnsC = (
  t: TFunction,
  language: string,
): ColumnDef<Customers>[] => [
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
    accessorKey: "name",
    header: t("columns.name"),
    cell: ({ row }) => {
      return `${row.original.name} ${row.original.last_name}`;
    },
    accessorFn: (row) => `${row.name} ${row.last_name}`,
  },
  { accessorKey: "phone", header: t("columns.phone") },
  {
    accessorKey: "status",
    header: t("columns.status"),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;

      const { label, color } = getStatusConfig(status, t);

      return <div className={color}>{label}</div>;
    },
  },
  {
    accessorKey: "debts",
    header: t("columns.debts"),
    meta: {
      headerClassName: "text-center",
    },
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue("debts")}</div>;
    },
    filterFn: partialNumberFilter,
  },
  {
    accessorKey: "debts_amount",
    header: t("columns.debt_amount"),
    cell: ({ row }) => {
      const formatted = currencyFormat(Number(row.getValue("debts_amount")));

      return <div className="font-semibold text-[#F57C00]">{formatted}</div>;
    },
    filterFn: partialNumberFilter,
  },
  {
    accessorKey: "debts_paid",
    header: t("columns.debt_paid"),
    cell: ({ row }) => {
      const formatted = currencyFormat(Number(row.getValue("debts_paid")));

      return <div className="font-semibold text-[#F57C00]">{formatted}</div>;
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
