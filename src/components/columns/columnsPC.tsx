import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import EyeIcon from "../../assets/icons/EyeIcon";
import DeleteIcon from "../../assets/icons/DeleteIcon";
import EditIcon from "../../assets/icons/EditIcon";
import { partialNumberFilter } from "@/utility/table-filter";
import { currencyFormat } from "@/utility/currencyFormat";

export type PaymentsCustomer = {
  id: string;
  created_at: string;
  code_sku: string;
  product: string;
  note: string;
  amount: number;
  actions?: {
    view?: boolean;
    delete?: boolean;
    edit?: boolean;
  };
};

// Columns Payments Customer
export const columnsPC: ColumnDef<PaymentsCustomer>[] = [
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
    header: "Created Date",
    meta: {
      headerClassName: "text-center",
    },
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue("created_at")}</div>;
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
    accessorKey: "note",
    header: "Note",
    cell: ({ getValue }) => (
      <div className="max-w-[300px] min-w-[200px] whitespace-normal leading-snug">
        {getValue() as string}
      </div>
    ),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const formatted = currencyFormat(Number(row.getValue("amount")));

      return <div className="font-semibold text-[#D32F2F]">{formatted}</div>;
    },
    filterFn: partialNumberFilter,
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
