import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import EyeIcon from "../../assets/icons/EyeIcon";
import DeleteIcon from "../../assets/icons/DeleteIcon";
import EditIcon from "../../assets/icons/EditIcon";
import { partialNumberFilter } from "@/utility/table-filter";
import { currencyFormat } from "@/utility/currencyFormat";

export type Products = {
  id: string;
  code_sku: string;
  name: string;
  description: string;
  category: string;
  ccolor: string;
  cost_price: number;
  unit_price: number;
  stock: number;
  status: string;
  created_at: string;
  actions?: {
    view?: boolean;
    delete?: boolean;
    edit?: boolean;
  };
};

// Columns Products
export const columnsTest: ColumnDef<Products>[] = [
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
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const ccolor = row.original.ccolor;
      return (
        <div
          style={{ background: ccolor }}
          className="rounded-full px-1 text-center font-semibold"
        >
          {row.getValue("category")}
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
        status === "active"
          ? "bg-[#43A047]"
          : status === "inactive"
          ? "bg-[#D32F2F]"
          : "bg-gray-400";

      return (
        <div
          className={`rounded-full px-1 text-center font-semibold text-white ${bgColor}`}
        >
          {status}
        </div>
      );
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
    enableSorting: false,
    enableHiding: false,
  },
];
