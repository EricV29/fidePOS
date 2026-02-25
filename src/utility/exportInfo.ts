import * as XLSX from "xlsx";
import type { dataExportProducts } from "@typesm/products";

export const exportToSpreadsheet = (
  format: string,
  data: dataExportProducts[][],
  page: string,
  statics: boolean,
) => {
  let finalContent: dataExportProducts[][];

  if (format === "csv" || !statics) {
    const tableStartIndex = data.findIndex((row) => row.includes("ID"));
    finalContent = tableStartIndex !== -1 ? data.slice(tableStartIndex) : data;
  } else {
    finalContent = data;
  }

  if (format === "csv" || format === "xlsx") {
    // Create Book Excel
    const worksheet = XLSX.utils.aoa_to_sheet(finalContent);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, page);

    // Download
    if (format === "xlsx") {
      XLSX.writeFile(workbook, `REPORT_${page}.xlsx`);
    } else {
      XLSX.writeFile(workbook, `REPORT_${page}.csv`, { bookType: "csv" });
    }
  } else if (format === "pdf") {
    console.log("PDF");
  }
};
