import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@components/ui/button";
import PlusIcon from "@icons/PlusIcon";
import { partialNumberFilter } from "@utility/table-filter";
import { currencyFormat } from "@utility/currencyFormat";
import type { ProductsSale } from "@typesm/products";
import { shadenHexColor } from "@utility/shadenHexColor";
import type { TFunction } from "i18next";

// Columns Products Sale
export const columnsPS = (t: TFunction): ColumnDef<ProductsSale>[] => [
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
    accessorKey: "unit_price",
    header: t("columns.unit_price"),
    cell: ({ row }) => {
      const formatted = currencyFormat(Number(row.getValue("unit_price")));

      return <div className="font-semibold text-[#F57C00]">{formatted}</div>;
    },
    filterFn: partialNumberFilter,
  },
  {
    id: "actions",
    header: "",
    cell: ({ row, table }) => {
      const product = row.original;

      return (
        <Button
          variant="outline"
          size="icon"
          onClick={() => table.options.meta?.addProduct?.(product)}
        >
          <PlusIcon color="#43A047" />
        </Button>
      );
    },
  },
];
