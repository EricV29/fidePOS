import type { ColumnDef } from "@tanstack/react-table";
import type { TFunction } from "i18next";
import { formatDateColumns } from "@utility/dateFormats";
import { getStatusConfig } from "@utility/statusColumns";
import { RowActions } from "@components/RowActions";
import type { Categories } from "@typesm/categories";
import { shadenHexColor } from "@utility/shadenHexColor";

// Columns Categories
export const columnsCAT = (
  t: TFunction,
  language: string,
): ColumnDef<Categories>[] => [
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
    accessorKey: "name",
    header: t("columns.name"),
    cell: ({ row }) => {
      const category = row.getValue("name") as string;
      const ccolor = row.original.color;
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

  { accessorKey: "description", header: t("columns.description") },
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
    accessorKey: "deleted_at",
    header: t("columns.deleted_at"),
    meta: {
      headerClassName: "text-center",
    },
    cell: ({ row }) => {
      const deletedAt = row.getValue("deleted_at") as string | null;

      return (
        <div className="text-center">
          {deletedAt ? formatDateColumns(deletedAt, language) : "—"}
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

      return <RowActions row={row.original} actions={actions} />;
    },
  },
];
