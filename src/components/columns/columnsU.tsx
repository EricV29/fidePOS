import type { ColumnDef } from "@tanstack/react-table";
import type { Users } from "@typesm/users";
import type { TFunction } from "i18next";
import { formatDateColumns } from "@utility/dateFormatColumns";
import { getStatusConfig } from "@utility/statusColumns";
import { getRolConfig } from "@utility/rolColumns";
import { RowActions } from "@components/RowActions";

// Columns Users
export const columnsU = (
  t: TFunction,
  language: string
): ColumnDef<Users>[] => [
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
      return `${row.original.name} ${row.original.last_name}`;
    },
    accessorFn: (row) => `${row.name} ${row.last_name}`,
  },
  { accessorKey: "email", header: t("columns.email") },
  { accessorKey: "phone", header: t("columns.phone") },
  { accessorKey: "password", header: t("columns.password") },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role") as string;

      const { label, color } = getRolConfig(role, t);

      return <div className={color}>{label}</div>;
    },
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

      return <RowActions row={row.original} actions={actions} />;
    },
  },
];
