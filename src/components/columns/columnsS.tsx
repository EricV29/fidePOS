import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@components/ui/button";
import PreviewIcon from "@/assets/icons/PreviewIcon";
import DeleteIcon from "@icons/DeleteIcon";
import EditIcon from "@icons/EditIcon";
import { partialNumberFilter } from "@utility/table-filter";
import { currencyFormat } from "@utility/currencyFormat";
import type { Sales } from "@typesm/sales";
import { shadenHexColor } from "@utility/shadenHexColor";
import type { TFunction } from "i18next";
import { getStatusConfig } from "@utility/statusColumns";
import { formatDateColumns } from "@utility/dateFormatColumns";

// Columns Sales
export const columnsS = (
  t: TFunction,
  language: string
): ColumnDef<Sales>[] => [
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
    accessorKey: "customer",
    header: t("columns.customer"),
    cell: ({ row }) => {
      return `${row.original.name} ${row.original.last_name}`;
    },
    accessorFn: (row) => `${row.name} ${row.last_name}`,
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
    accessorKey: "total_amount",
    header: t("columns.total_amount"),
    cell: ({ row }) => {
      const formatted = currencyFormat(Number(row.getValue("total_amount")));

      return <div className="font-semibold text-[#43A047]">{formatted}</div>;
    },
    filterFn: partialNumberFilter,
  },
  {
    accessorKey: "paid_amount",
    header: t("columns.paid_amount"),
    cell: ({ row }) => {
      const formatted = currencyFormat(Number(row.getValue("paid_amount")));

      return <div className="font-semibold text-[#43A047]">{formatted}</div>;
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
    id: "actions",
    header: t("columns.actions"),
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
              <PreviewIcon />
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
