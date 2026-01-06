import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@components/ui/button";
import DeleteIcon from "@icons/DeleteIcon";
import { partialNumberFilter } from "@utility/table-filter";
import { currencyFormat } from "@utility/currencyFormat";
import type { ShoppingCarT } from "@typesm/sales";
import type { TFunction } from "i18next";

// Columns Shooping Car
export const columnsSC = (t: TFunction): ColumnDef<ShoppingCarT>[] => [
  {
    accessorKey: "product",
    header: t("columns.product"),
    cell: ({ row }) => {
      const unit_priceF = currencyFormat(Number(row.original.unit_price));

      return (
        <div>
          <p className="font-bold text-[20px]">{row.original.product}</p>
          <p className="font-extralight">
            {t("columns.unit_price")}: {unit_priceF}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "quantity",
    header: t("columns.quantity"),
    cell: ({ row, table }) => {
      const quantity = row.original.quantity;

      const updateQuantity = (newValue: number) => {
        const update = table.options.meta?.updateData;
        if (!update) return;
        update(row.index, "quantity", newValue);
      };

      return (
        <div className="w-[70px] flex items-center justify-between border border-white rounded bg-[#F57C00] text-white text-[17px]">
          <button
            className="px-2"
            onClick={() => updateQuantity(Math.max(1, quantity - 1))}
          >
            −
          </button>

          <span className="text-center">{quantity}</span>

          <button className="px-2" onClick={() => updateQuantity(quantity + 1)}>
            +
          </button>
        </div>
      );
    },
  },
  {
    accessorKey: "total_amount",
    header: "Total",
    cell: ({ row }) => {
      const formatted = currencyFormat(Number(row.getValue("total_amount")));
      return <div className="font-semibold text-[#F57C00]">{formatted}</div>;
    },
    filterFn: partialNumberFilter,
  },
  {
    id: "actions",
    header: "",
    meta: {
      headerClassName: "text-center",
    },
    cell: ({ row, table }) => {
      const deleteProduct = table.options.meta?.deleteProduct;
      return (
        <div className="flex justify-center items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => deleteProduct?.(row.original.id)}
          >
            <DeleteIcon color="#D32F2F" />
          </Button>
        </div>
      );
    },
  },
];
