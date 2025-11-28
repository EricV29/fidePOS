import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import EyeIcon from "../../assets/icons/EyeIcon";
import DeleteIcon from "../../assets/icons/DeleteIcon";
import EditIcon from "../../assets/icons/EditIcon";

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
export const columnsP: ColumnDef<Products>[] = [
  {
    id: "rowNumber",
    header: () => <div className="text-center">No.</div>,
    cell: ({ row }) => {
      return <div className="text-center font-semibold">{row.index + 1}</div>;
    },
    enableSorting: false,
    enableHiding: false,
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
      const cost_price = parseFloat(row.getValue("cost_price"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(cost_price);

      return <div className="font-semibold text-[#D32F2F]">{formatted}</div>;
    },
  },
  {
    accessorKey: "unit_price",
    header: "Unit Price",
    cell: ({ row }) => {
      const unit_price = parseFloat(row.getValue("unit_price"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(unit_price);

      return <div className="font-semibold text-[#F57C00]">{formatted}</div>;
    },
  },
  {
    accessorKey: "stock",
    header: () => <div className="text-center">Stock</div>,
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue("stock")}</div>;
    },
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
    header: () => <div className="text-center">Created Date</div>,
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue("created_at")}</div>;
    },
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
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
