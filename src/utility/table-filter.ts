export const partialNumberFilter = (row, columnId, filterValue) => {
  if (!filterValue) return true;

  const cellValue = row.getValue(columnId);

  if (cellValue == null) return false;

  const cell = String(cellValue).replace(/[^0-9.-]/g, "");
  const filter = String(filterValue).replace(/[^0-9.-]/g, "");

  return cell.includes(filter);
};
