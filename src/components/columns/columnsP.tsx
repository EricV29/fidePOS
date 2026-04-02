import type { ColumnDef } from "@tanstack/react-table";
import { partialNumberFilter } from "@utility/table-filter";
import { currencyFormat } from "@utility/currencyFormat";
import type { Products } from "@typesm/products";
import { shadenHexColor } from "@utility/shadenHexColor";
import type { TFunction } from "i18next";
import { formatDateColumns } from "@utility/dateFormats";
import { getStatusConfig } from "@utility/statusColumns";
import { RowActions } from "@components/RowActions";

// Columns Products
export const columnsP = (
  t: TFunction,
  language: string,
): ColumnDef<Products>[] => [
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
    accessorKey: "code_sku",
    header: t("columns.code"),
  },
  {
    accessorKey: "product",
    header: t("columns.product"),
  },
  {
    accessorKey: "description",
    header: t("columns.description"),
    cell: ({ getValue }) => (
      <div className="max-w-[300px] min-w-[200px] whitespace-normal leading-snug">
        {getValue() as string}
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: t("columns.category"),
    cell: ({ row }) => {
      const category = row.getValue("category") as string;
      const ccolor = row.original.ccolor;
      const background = shadenHexColor(ccolor);

      return (
        <div
          style={{
            background,
            color: ccolor,
          }}
          className="categoryB"
        >
          {category.toUpperCase()}
        </div>
      );
    },
  },
  {
    accessorKey: "cost_price",
    header: t("columns.cost_price"),
    cell: ({ row }) => {
      const formatted = currencyFormat(Number(row.getValue("cost_price")));

      return <div className="font-semibold text-[#D32F2F]">{formatted}</div>;
    },
    filterFn: partialNumberFilter,
  },
  {
    accessorKey: "unit_price",
    header: t("columns.unit_price"),
    cell: ({ row }) => {
      const formatted = currencyFormat(Number(row.getValue("unit_price")));

      return <div className="font-semibold text-[#F57C00]">{formatted}</div>;
    },
    filterFn: partialNumberFilter,
  },
  {
    accessorKey: "stock",
    header: "Stock",
    meta: {
      headerClassName: "text-center",
    },
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue("stock")}</div>;
    },
    filterFn: partialNumberFilter,
  },
  {
    accessorKey: "profit",
    header: t("columns.profit"),
    cell: ({ row }) => {
      const formatted = currencyFormat(Number(row.getValue("profit")));

      return <div className="font-semibold text-[#F57C00]">{formatted}</div>;
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
    accessorKey: "deleted_at",
    header: t("columns.deleted_at"),
    meta: {
      headerClassName: "text-center",
    },
    cell: ({ row }) => {
      const value = row.getValue("deleted_at");
      if (!value) return null;
      return (
        <div className="text-center">
          {formatDateColumns(value as string, language)}
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
