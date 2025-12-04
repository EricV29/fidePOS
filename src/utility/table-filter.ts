import type { Row } from "@tanstack/react-table";

export const partialNumberFilter = <TData>(
  row: Row<TData>,
  columnId: string,
  filterValue: unknown
): boolean => {
  if (!filterValue) return true;

  const cellValue = row.getValue(columnId);
  if (cellValue == null) return false;

  const cell = String(cellValue).replace(/[^0-9.-]/g, "");
  const filter = String(filterValue).replace(/[^0-9.-]/g, "");

  return cell.includes(filter);
};
