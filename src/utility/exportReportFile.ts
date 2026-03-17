import type { dataExportProducts } from "@typesm/products";

export const exportReportFile = async (
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
    // DYNAMIC IMPORT
    const XLSX = await import("xlsx");

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
    // DYNAMIC IMPORT
    const { default: jsPDF } = await import("jspdf");
    const { default: autoTable } = await import("jspdf-autotable");

    // Statistics?
    const tableStartIndex = data.findIndex((row) => row.includes("ID"));

    // View DOC (H or V)
    const doc = new jsPDF("l", "mm", "a4");
    let currentY = 15;

    const tableIndices = data
      .map((row, index) => (row.includes("ID") ? index : -1))
      .filter((index) => index !== -1);

    // Draw statistics
    if (statics && tableStartIndex > 0) {
      doc.setFontSize(14);
      doc.setTextColor(40);

      const statsSection = data.slice(0, tableIndices[0]);

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
    tableIndices.forEach((startIndex, i) => {
      const nextTableIndex = tableIndices[i + 1] || data.length;

      if (startIndex > 0) {
        const potentialTitleRow = data[startIndex - 1];
        if (potentialTitleRow.length === 1 && potentialTitleRow[0] !== "") {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(14);
          doc.text(`${potentialTitleRow[0]}`, 14, currentY + 5);
          currentY += 8;
        }
      }

      const tableData = data
        .slice(startIndex, nextTableIndex)
        .filter((row) => row.length > 1);

      if (tableData.length > 0) {
        const headers = [tableData[0].map((cell) => cell ?? "")];
        const body = tableData
          .slice(1)
          .map((row) => row.map((cell) => cell ?? ""));

        autoTable(doc, {
          startY: currentY + 10,
          head: headers,
          body: body,
          theme: "striped",
          styles: { fontSize: 7 },
          headStyles: { fillColor: [41, 128, 185] },
          margin: { left: 14, right: 14 },
        });

        currentY = (doc as any).lastAutoTable.finalY;
      }
    });

    doc.save(`REPORT_${page}.pdf`);
  }
};
