import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@components/ui/button";
import DeleteIcon from "@icons/DeleteIcon";
import EditIcon from "@icons/EditIcon";
import EyeIcon from "@icons/EyeIcon";
import PlusIcon from "@icons/PlusIcon";
import { partialNumberFilter } from "@utility/table-filter";
import { currencyFormat } from "@utility/currencyFormat";
import type { ProductsSale } from "@typesm/products";

// Columns Products Sale
export const columnsPS: ColumnDef<ProductsSale>[] = [
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
    header: "Code SKU",
  },
  {
    accessorKey: "product",
    header: "Product",
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ getValue }) => (
      <div className="max-w-[300px] min-w-[200px] whitespace-normal leading-snug">
        {getValue() as string}
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const category = row.getValue("category") as string;
      const ccolor = row.original.ccolor;
      return (
        <div style={{ background: ccolor }} className="categoryB">
          {category.toLocaleUpperCase()}
        </div>
      );
    },
  },
  {
    accessorKey: "unit_price",
    header: "Unit Price",
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
