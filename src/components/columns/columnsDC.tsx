import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@components/ui/button";
import EyeIcon from "@icons/EyeIcon";
import DeleteIcon from "@icons/DeleteIcon";
import EditIcon from "@icons/EditIcon";
import { partialNumberFilter } from "@utility/table-filter";
import { currencyFormat } from "@utility/currencyFormat";
import type { DebtsCustomer } from "@typesm/customers";
import { shadenHexColor } from "@utility/shadenHexColor";

// Columns Debts Customer
export const columnsDC: ColumnDef<DebtsCustomer>[] = [
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
    accessorKey: "debt_amount",
    header: "Debt Amount",
    cell: ({ row }) => {
      const formatted = currencyFormat(Number(row.getValue("debt_amount")));

      return <div className="font-semibold text-[#F57C00]">{formatted}</div>;
    },
    filterFn: partialNumberFilter,
  },
  {
    accessorKey: "debt_paid",
    header: "Debt Paid",
    cell: ({ row }) => {
      const formatted = currencyFormat(Number(row.getValue("debt_paid")));

      return <div className="font-semibold text-[#F57C00]">{formatted}</div>;
    },
    filterFn: partialNumberFilter,
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
