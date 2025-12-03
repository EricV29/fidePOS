import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@components/ui/button";
import EyeIcon from "@icons/EyeIcon";
import DeleteIcon from "@icons/DeleteIcon";
import EditIcon from "@icons/EditIcon";
import { partialNumberFilter } from "@utility/table-filter";
import { currencyFormat } from "@utility/currencyFormat";
import type { Products } from "@typesm/products";

// Columns Products
export const columnsP: ColumnDef<Products>[] = [
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
    accessorKey: "cost_price",
    header: "Cost Price",
    cell: ({ row }) => {
      const formatted = currencyFormat(Number(row.getValue("cost_price")));

      return <div className="font-semibold text-[#D32F2F]">{formatted}</div>;
    },
    filterFn: partialNumberFilter,
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
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const bgColor =
        status === "active" || status === "paid"
          ? "statusActiveB"
          : status === "inactive" || status == "unpaid"
          ? "statusInactiveB"
          : status === "debt"
          ? "statusDebtB"
          : "bg-gray-400";

      return <div className={bgColor}>{status.toLocaleUpperCase()}</div>;
    },
  },
  {
    accessorKey: "created_at",
    header: "Created Date",
    meta: {
      headerClassName: "text-center",
    },
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue("created_at")}</div>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    meta: {
      headerClassName: "text-center",
    },
    cell: ({ row, table }) => {
      const actions = table.options.meta?.actions;

      const handleDescription = () => {
        console.log("ID:", row.original.id);
      };

      return (
        <div className="flex justify-center items-center space-x-2">
          {actions?.view && (
            <Button variant="outline" size="icon" onClick={handleDescription}>
              <EyeIcon />
            </Button>
          )}

          {actions?.edit && (
            <Button variant="outline" size="icon" onClick={handleDescription}>
              <EditIcon color="#F57C00" />
            </Button>
          )}

          {actions?.delete && (
            <Button variant="outline" size="icon" onClick={handleDescription}>
              <DeleteIcon color="#D32F2F" />
            </Button>
          )}
        </div>
      );
    },
  },
];
