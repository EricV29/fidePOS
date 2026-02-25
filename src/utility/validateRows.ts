import type { ExcelProductRow } from "@typesm/products";
import type { CategoriesSelect } from "@typesm/categories";

type ValidationResult =
  | ExcelProductRow[]
  | {
      error: string;
      data:
        | number
        | string
        | { rowNumber: number; [key: string]: string | number };
    };

const validateCategories = async (
  systemCategories: CategoriesSelect[],
  excelCategories: string,
) => {
  if (!systemCategories) return null;

  const found = systemCategories.find(
    (cat) =>
      cat.name.toLowerCase().trim() === excelCategories.toLowerCase().trim(),
  );

  return found || null;
};

export const validateRows = async (
  data: ExcelProductRow[],
): Promise<ValidationResult> => {
  // Get system categories
  const response = await window.electronAPI.getCategoriesSelect();
  if (!response.success) {
    return {
      error: "error_db",
      data: "error_db",
    };
  }
  const systemCategories = response.result ? response.result : [];

  // Validation Rows
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const rowNumber = i + 2;

    // Validate null of column product
    if (!row.product || String(row.product).trim() === "") {
      return {
        error: "null_product",
        data: rowNumber,
      };
    }

    // Validate null of column category
    if (!row.category || String(row.category).trim() === "") {
      return {
        error: "null_category",
        data: rowNumber,
      };
    }

    // Validate categories with system categories
    const categoryFound = await validateCategories(
      systemCategories,
      row.category,
    );

    if (!categoryFound) {
      return {
        error: "not_match_category",
        data: { rowNumber: rowNumber, category: row.category },
      };
    }

    // Validate numbers columns
    const cost = parseFloat(String(row.cost_price));
    const unit = parseFloat(String(row.unit_price));
    const stock = row.stock ? parseInt(String(row.stock)) : 0;
    const code_sku = row.code_sku ? String(row.code_sku).trim() : undefined;
    const description = row.description
      ? String(row.description).trim()
      : undefined;

    if (isNaN(cost) || isNaN(unit) || isNaN(stock)) {
      return {
        error: "number_columns",
        data: rowNumber,
      };
    }

    // Save data for insert
    data[i] = {
      ...row,
      product: String(row.product).trim(),
      description: description,
      category_id: categoryFound.id,
      cost_price: cost,
      unit_price: unit,
      stock: stock,
      code_sku: code_sku,
    };
  }

  return data;
};
