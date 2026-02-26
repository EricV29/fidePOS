import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { dataExportProducts } from "@typesm/products";

export const exportReportFile = (
  format: string,
  data: dataExportProducts[][],
  page: string,
  statics: boolean,
) => {
  let finalContent: dataExportProducts[][];

  // Statistics?
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
    // Statistics?
    const tableStartIndex = data.findIndex((row) => row.includes("ID"));

    // View DOC (H or V)
    const doc = new jsPDF("l", "mm", "a4");
    let currentY = 15;

    // Draw statistics
    if (statics && tableStartIndex > 0) {
      doc.setFontSize(14);
      doc.setTextColor(40);

      const statsSection = data.slice(0, tableStartIndex);

      statsSection.forEach((row) => {
        if (row.length === 0 || (row.length === 1 && row[0] === "")) {
          currentY += 5;
          return;
        }

        // Draw 2 rows (key: value)
        if (row.length >= 2) {
          doc.setFont("helvetica", "bold");
          doc.text(`${row[0]}:`, 14, currentY);
          doc.setFont("helvetica", "normal");
          doc.text(`${row[1]}`, 60, currentY);
        } else if (row.length === 1) {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(16);
          doc.text(`${row[0]}`, 14, currentY);
          currentY += 2;
        }

        currentY += 8;
        doc.setFontSize(11);
      });
    }

    // Draw Table
    const rawHeaders = data[tableStartIndex] || [];
    const headers = [rawHeaders.map((cell) => cell ?? "")];
    const body = data
      .slice(tableStartIndex + 1)
      .map((row) => row.map((cell) => cell ?? ""));

    autoTable(doc, {
      startY: currentY + 5,
      head: headers,
      body: body,
      theme: "striped",
      styles: { fontSize: 7 },
      headStyles: { fillColor: [41, 128, 185] },
      margin: { left: 14, right: 14 },
    });

    doc.save(`REPORT_${page}.pdf`);
  }
};
