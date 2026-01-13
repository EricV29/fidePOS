import type { ColumnDef } from "@tanstack/react-table";
import { partialNumberFilter } from "@utility/table-filter";
import { currencyFormat } from "@utility/currencyFormat";
import type { Sales } from "@typesm/sales";
import type { TFunction } from "i18next";
import { getStatusConfig } from "@utility/statusColumns";
import { formatDateColumns } from "@utility/dateFormatColumns";
import { RowActions } from "@components/RowActions";

// Columns Sales
export const columnsS = (
  t: TFunction,
  language: string
): ColumnDef<Sales>[] => [
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
    accessorKey: "products",
    header: t("columns.products"),
    cell: ({ getValue }) => (
      <div className="max-w-[300px] min-w-[200px] whitespace-normal leading-snug">
        {getValue() as string}
      </div>
    ),
  },
  {
    accessorKey: "total_amount",
    header: t("columns.total_amount"),
    cell: ({ row }) => {
      const formatted = currencyFormat(Number(row.getValue("total_amount")));

      return <div className="font-semibold text-[#F57C00]">{formatted}</div>;
    },
    filterFn: partialNumberFilter,
  },
  {
    accessorKey: "paid_amount",
    header: t("columns.paid_amount"),
    cell: ({ row }) => {
      const formatted = currencyFormat(Number(row.getValue("paid_amount")));

      return <div className="font-semibold text-[#43A047]">{formatted}</div>;
    },
    filterFn: partialNumberFilter,
  },
  {
    accessorKey: "pending_amount",
    header: t("columns.debt_pending"),
    cell: ({ row }) => {
      const formatted = currencyFormat(Number(row.getValue("pending_amount")));

      return <div className="font-semibold text-[#D32F2F]">{formatted}</div>;
    },
    filterFn: partialNumberFilter,
  },
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
