import { useState } from "react";
import { useTranslation } from "react-i18next";
import * as XLSX from "xlsx";
import { validateRows } from "@utility/validateRows";
import { useLoading } from "@context/LoadingContext";
import type { ExcelRow, ExcelProductRow } from "@typesm/products";
import { useModal } from "@context/ModalContext";
import AUTH_CODES from "../../constants/authCodes.json";

const REQUIRED_COLUMNS = ["product", "category", "cost_price", "unit_price"];
const OPTIONAL_COLUMNS = ["code_sku", "stock"];

export default function FileDropZone() {
  const [isDragging, setIsDragging] = useState(false);
  const { t } = useTranslation();
  const { setLoading } = useLoading();
  const { triggerResponseAlert } = useModal();

  const insertProductsImport = async (data) => {
    const response = await window.electronAPI.addProductsImport(data);
    if (response.success) {
      setLoading(false);
      triggerResponseAlert(response.result);
    } else {
      setLoading(false);
      triggerResponseAlert(response.error);
    }
  };

  const handleFiles = async (files: FileList) => {
    setLoading(true);
    const file = files[0];
    if (!file) {
      setLoading(false);
      return;
    }

    const reader = new FileReader();

    reader.onload = async (e) => {
      const data = e.target?.result;
      const workbook = XLSX.read(data, { type: "binary" });

      // First page
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // Convert to JSON
      const rows = XLSX.utils.sheet_to_json(sheet, {
        header: 1,
      }) as ExcelRow[][];

      if (rows.length === 0) {
        setLoading(false);
        triggerResponseAlert(AUTH_CODES.EMPTY_FILE);
        return;
      }

      const ALLOWED_COLUMNS = [...REQUIRED_COLUMNS, ...OPTIONAL_COLUMNS];

      // Headers
      const headers = rows[0].map((h: ExcelRow) =>
        String(h).toLowerCase().trim(),
      );

      // Verify required columns
      const missingColumns = REQUIRED_COLUMNS.filter(
        (col) => !headers.includes(col),
      );

      if (missingColumns.length > 0) {
        setLoading(false);
        triggerResponseAlert(AUTH_CODES.MISSING_COLUMNS, {
          columns: missingColumns.join(", "),
        });
        return;
      }

      // Data to object JSON
      const rawDataRows = XLSX.utils.sheet_to_json(sheet) as ExcelProductRow[];

      // Delete extra columns
      const cleanDataRows = rawDataRows.map((row) => {
        const filteredRow = {} as ExcelProductRow;

        Object.keys(row).forEach((key) => {
          const normalizedKey = key.toLowerCase().trim();

          if (ALLOWED_COLUMNS.includes(normalizedKey)) {
            filteredRow[normalizedKey] = row[key];
          }
        });

        return filteredRow;
      });

      if (cleanDataRows.length <= 0) {
        setLoading(false);
        triggerResponseAlert(AUTH_CODES.EMPTY_PRODUCTS);
        return;
      }

      const resultRows = await validateRows(cleanDataRows);
      if (!Array.isArray(resultRows)) {
        setLoading(false);
        if (resultRows.error === "null_product") {
          alert(
            `${t("modalImport.row")} ${resultRows.data}: ${t("modalImport.text_null_product")}`,
          );
        }

        if (resultRows.error === "null_category") {
          alert(
            `${t("modalImport.row")} ${resultRows.data}: ${t("modalImport.text_null_category")}`,
          );
        }

        if (resultRows.error === "not_match_category") {
          if (typeof resultRows.data === "object" && resultRows.data !== null) {
            const { rowNumber, category } = resultRows.data;
            alert(
              `${t("modalImport.row")} ${rowNumber}: ${t("modalImport.text_not_match_catergoy_one")} (${category}) ${t("modalImport.text_not_match_catergoy_two")}`,
            );
          }
        }

        if (resultRows.error === "number_columns") {
          alert(
            `${t("modalImport.row")} ${resultRows.data}: ${t("modalImport.text_number_columns")}`,
          );
        }
        return;
      }

      insertProductsImport(resultRows);
    };

    reader.readAsBinaryString(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => setIsDragging(false);

  return (
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      className={`border-2 border-dashed rounded-[7px] p-6 text-center cursor-pointer transition
        ${isDragging ? "border-[#F57C00] bg-[#FFEFDE]" : "border-[#F57C00]"}
      `}
    >
      <p className="text-gray-500">{t("dropZone.text1")}</p>
      <label
        htmlFor="fileInput"
        className="text-blue-600 underline cursor-pointer font-medium"
      >
        {t("dropZone.text2")}
      </label>
      <input
        id="fileInput"
        type="file"
        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        className="hidden"
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
      />
    </div>
  );
}
