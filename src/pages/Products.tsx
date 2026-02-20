import { useState, useEffect, useCallback } from "react";
import ExportIcon from "@icons/ExportIcon";
import ImportIcon from "@icons/ImportIcon";
import CategoryIcon from "@icons/CategoryIcon";
import BoxPlusIcon from "@icons/BoxPlusIcon";
import InvestmentIcon from "@icons/InvestmentIcon";
import RevenueIcon from "@icons/RevenueIcon";
import CardInfoNumber from "@components/CardInfoNumber";
import CardInfoDetail from "@components/CardInfoDetail";
import { DataTableSearch } from "@components/data-table-search";
import { columnsP } from "@columns/columnsP";
import type { Products } from "@typesm/products";
import { useModal } from "@context/ModalContext";
import { ModalExport } from "@modals/ModalExport";
import { ModalImport } from "@modals/ModalImport";
import { ModalAddProduct } from "@modals/ModalAddProduct";
import { ModalAddCategory } from "@modals/ModalAddCategory";
import { useTranslation } from "react-i18next";
interface dataStockI {
  [key: string]: number;
}

export default function Products() {
  const { t, i18n } = useTranslation();
  const [productsStock, setProductsStock] = useState<dataStockI>();
  const [dataProducts, setProducts] = useState<Products[]>([]);
  const { setModal } = useModal();
  const [investCard, setInvestCard] = useState(Number);
  const [inventoryValueCard, setInventoryValueCard] = useState(Number);
  const [totalRows, setTotalRows] = useState(0);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const loadPorducts = useCallback(async () => {
    const limit = pagination.pageSize;
    const offset = pagination.pageIndex * pagination.pageSize;

    const response = await window.electronAPI.getProductsData({
      limit: limit,
      offset: offset,
    });
    const productsData =
      typeof response.result === "string"
        ? JSON.parse(response.result)
        : response.result;

    if (productsData?.investment) {
      const investmentData = productsData.investment.result;
      setInvestCard(investmentData[0].investment);
    }

    if (productsData?.inventoryValue) {
      const inventoryValueData = productsData.inventoryValue.result;
      setInventoryValueCard(inventoryValueData[0].inventory_value);
    }

    if (productsData?.productsStock) {
      const productsStockData = productsData.productsStock.result;
      setProductsStock(productsStockData[0]);
    }

    if (productsData?.inventoryTable) {
      const inventoryTableData = productsData.inventoryTable.result;
      setProducts(inventoryTableData);
      setTotalRows(productsData.inventoryTable.totalCount);
    }
  }, [pagination]);

  useEffect(() => {
    loadPorducts();
  }, [loadPorducts]);

  function deleteProduct(id: string) {
    console.log("Deleting product:", id);
  }

  const columnsp = columnsP(t, i18n.language);

  return (
    <>
      <div className="w-full h-full flex flex-col min-h-0">
        <div className="w-full h-fit flex justify-between items-end">
          <h1 style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.25rem)" }}>
            {t("products.title")}
          </h1>
          <div className="flex gap-2">
            <button
              className="bnormal"
              onClick={() =>
                setModal(<ModalExport data={{ data: "Products Statistics" }} />)
              }
            >
              <ExportIcon /> <p> {t("buttons.btn_export")}</p>
            </button>
            <button
              className="bnormal"
              onClick={() => setModal(<ModalImport />)}
            >
              <ImportIcon /> <p> {t("buttons.btn_import")}</p>
            </button>
            <button
              className="bnormal"
              onClick={() => setModal(<ModalAddProduct />)}
            >
              <BoxPlusIcon /> <p> {t("buttons.btn_add_product")}</p>
            </button>
            <button
              className="bnormal"
              onClick={() => setModal(<ModalAddCategory />)}
            >
              <CategoryIcon /> <p> {t("buttons.btn_add_category")}</p>
            </button>
          </div>
        </div>
        <hr className="border border-[#b3b3b3] my-2" />
        <div className="flex-1 min-h-0 w-full flex flex-col gap-2">
          <div className="w-full h-[120px] flex justify-between gap-2">
            <CardInfoNumber
              icon={InvestmentIcon}
              title={t("cards.investment_title")}
              icond={null}
              number={investCard}
              format={true}
              color="#F57C00"
            />

            <CardInfoNumber
              icon={RevenueIcon}
              title={t("cards.inventory_value_title")}
              icond={null}
              number={inventoryValueCard}
              format={true}
              color="#FFC107"
            />
            <CardInfoDetail
              chartData={productsStock!}
              title={t("cards.stock_title")}
              color="#1976D2"
            />
          </div>
          <div className="w-full min-h-0 flex flex-col flex-1 p-4 gap-4 border-2 border-[#b3b3b3] rounded-[10px] bg-transparent">
            <p className="font-semibold dark:text-white">
              {" "}
              {t("products.table1")}
            </p>
            <DataTableSearch
              data={dataProducts}
              columns={columnsp}
              actions={{
                onEdit: (row) => {
                  setModal(<ModalAddProduct data={row} />);
                },
                onDelete: (row) => {
                  deleteProduct(row.id);
                },
              }}
              pagination={pagination}
              setPagination={setPagination}
              totalRows={totalRows}
            />
          </div>
        </div>
      </div>
    </>
  );
}
