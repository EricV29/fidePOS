import { Button } from "@/components/ui/button";
import PreviewIcon from "@icons/PreviewIcon";
import EditIcon from "@icons/EditIcon";
import DeleteIcon from "@icons/DeleteIcon";
import type { TableMeta } from "@tanstack/react-table";

interface Props<T> {
  row: T;
  actions?: TableMeta<T>["actions"];
}

export function RowActions({ row, actions }: Props) {
  if (!actions) return null;

  return (
    <div className="flex justify-center gap-2">
      {actions.onView && (
        <Button
          variant="outline"
          size="icon"
          onClick={() => actions.onView?.(row)}
        >
          <PreviewIcon />
        </Button>
      )}

      {actions.onEdit && (
        <Button
          variant="outline"
          size="icon"
          onClick={() => actions.onEdit?.(row)}
        >
          <EditIcon color="#F57C00" />
        </Button>
      )}

      {actions.onDelete && (
        <Button
          variant="outline"
          size="icon"
          onClick={() => actions.onDelete?.(row)}
        >
          <DeleteIcon color="#D32F2F" />
        </Button>
      )}
    </div>
  );
}
