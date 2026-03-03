import type { ColumnDef } from "@tanstack/react-table";
import { partialNumberFilter } from "@utility/table-filter";
import { currencyFormat } from "@utility/currencyFormat";
import type { DebtsCustomer } from "@typesm/customers";
import type { TFunction } from "i18next";
import { formatDateColumns } from "@utility/dateFormats";
import { RowActions } from "@components/RowActions";

// Columns Debts Customer
export const columnsDC = (
  t: TFunction,
  language: string,
): ColumnDef<DebtsCustomer>[] => [
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
    accessorKey: "sale_num",
    header: t("columns.sale_num"),
  },
  {
    accessorKey: "codes_sku",
    header: t("columns.code"),
    cell: ({ getValue }) => {
      const value = getValue() as string;
      if (!value) return null;

      return (
        <div style={{ lineHeight: "1.2" }}>
          {value.split("|").map((sku, index) => (
            <div key={index}>{sku}</div>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "products",
    header: t("columns.product"),
    cell: ({ getValue }) => {
      const value = getValue() as string;
      if (!value) return null;

      return (
        <div style={{ lineHeight: "1.2" }}>
          {value.split("|").map((sku, index) => (
            <div key={index}>{sku}</div>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "descriptions",
    header: t("columns.description"),
    cell: ({ getValue }) => {
      const value = getValue() as string;
      if (!value) return null;

      return (
        <div
          style={{ lineHeight: "1.2" }}
          className="max-w-[300px] min-w-[200px] whitespace-normal leading-snug"
        >
          {value.split("|").map((sku, index) => (
            <div key={index}>{sku}</div>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "debt_amount",
    header: t("columns.debt_amount"),
    cell: ({ row }) => {
      const formatted = currencyFormat(Number(row.getValue("debt_amount")));

      return <div className="font-semibold text-[#D32F2F]">{formatted}</div>;
    },
    filterFn: partialNumberFilter,
  },
  {
    accessorKey: "sale_total",
    header: t("columns.sale_total"),
    cell: ({ row }) => {
      const formatted = currencyFormat(Number(row.getValue("sale_total")));

      return <div className="font-semibold text-[#F57C00]">{formatted}</div>;
    },
    filterFn: partialNumberFilter,
  },
  {
    accessorKey: "debt_paid",
    header: t("columns.debt_paid"),
    cell: ({ row }) => {
      const formatted = currencyFormat(Number(row.getValue("debt_paid")));

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
