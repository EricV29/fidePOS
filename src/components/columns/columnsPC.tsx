import type { ColumnDef } from "@tanstack/react-table";
import { partialNumberFilter } from "@utility/table-filter";
import { currencyFormat } from "@utility/currencyFormat";
import type { PaymentsCustomer } from "@typesm/customers";
import type { TFunction } from "i18next";
import { formatDateColumns } from "@utility/dateFormats";

// Columns Payments Customer
export const columnsPC = (
  t: TFunction,
  language: string,
): ColumnDef<PaymentsCustomer>[] => [
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
    accessorKey: "code_sku",
    header: t("columns.code"),
  },
  {
    accessorKey: "product",
    header: t("columns.product"),
  },
  {
    accessorKey: "note",
    header: t("columns.note"),
    cell: ({ getValue }) => (
      <div className="max-w-[300px] min-w-[200px] whitespace-normal leading-snug">
        {getValue() as string}
      </div>
    ),
  },
  {
    accessorKey: "amount",
    header: t("columns.total_amount"),
    cell: ({ row }) => {
      const formatted = currencyFormat(Number(row.getValue("amount")));

      return <div className="font-semibold text-[#D32F2F]">{formatted}</div>;
    },
    filterFn: partialNumberFilter,
  },
];
