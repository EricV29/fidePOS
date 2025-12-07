import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@components/ui/button";
import DeleteIcon from "@icons/DeleteIcon";
import EditIcon from "@icons/EditIcon";
import EyeIcon from "@icons/EyeIcon";
import PlusIcon from "@icons/PlusIcon";
import { partialNumberFilter } from "@utility/table-filter";
import { currencyFormat } from "@utility/currencyFormat";
import type { ShoppingCar } from "@typesm/sales";

// Columns Shooping Car
export const columnsSC: ColumnDef<ShoppingCar>[] = [
  {
    accessorKey: "product",
    header: "Product",
    cell: ({ row }) => {
      return (
        <div>
          <p className="font-bold text-[20px]">{row.original.product}</p>
          <p className="font-extralight">
            Unit price: {row.original.unit_price}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: ({ row, table }) => {
      const quantity = row.original.quantity;

      // Función para actualizar la cantidad en la tabla (usando meta.updateData)
      const updateQuantity = (newValue: number) => {
        const update = table.options.meta?.updateData;
        if (!update) return;
        update(row.index, "quantity", newValue);
      };

      return (
        <div className="flex items-center gap-2">
          <button
            className="px-2 py-1 border rounded"
            onClick={() => updateQuantity(Math.max(1, quantity - 1))}
          >
            −
          </button>

          <span className="min-w-[30px] text-center">{quantity}</span>

          <button
            className="px-2 py-1 border rounded"
            onClick={() => updateQuantity(quantity + 1)}
          >
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
      const actions = table.options.meta?.actions;

      return (
        <div className="flex justify-center items-center space-x-2">
          {actions?.add && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => actions.add(row.original.id)}
            >
              <PlusIcon color="#43A047" />
            </Button>
          )}
        </div>
      );
    },
  },
];
