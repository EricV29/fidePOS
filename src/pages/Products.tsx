import { useState, useEffect } from "react";
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

//* Example data stock products
const dataStockDB = { Stock: 100, "No Stock": 40 };

//* Example data products
const dataProductsDB = [
  {
    id: "34234",
    code_sku: "JW0012",
    product: "Labial",
    description: "Yuya rojo",
    category: "Maquillaje",
    ccolor: "#5b49ff",
    cost_price: 123.5,
    unit_price: 20000,
    stock: 1,
    status: "active",
    created_at: "01/01/2025",
  },
  {
    id: "34235",
    code_sku: "JW0013",
    product: "Carrito",
    description: "hotweels",
    category: "Toys",
    ccolor: "#ff49ff",
    cost_price: 12000,
    unit_price: 30000,
    stock: 2,
    status: "inactive",
    created_at: "01/10/2025",
  },
];

export default function Products() {
  const { t, i18n } = useTranslation();
  const [dataStock, setStock] = useState<dataStockI>();
  const [dataProducts, setProducts] = useState<Products[]>([]);
  const { setModal } = useModal();

  useEffect(() => {
    setStock(dataStockDB);
    setProducts(dataProductsDB);
  }, []);

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
              number={100000}
              format={true}
              color="#F57C00"
            />

            <CardInfoNumber
              icon={RevenueIcon}
              title={t("cards.inventory_value_title")}
              icond={null}
              number={100000}
              format={true}
              color="#FFC107"
            />
            <CardInfoDetail
              chartData={dataStock!}
              title={t("cards.stock_title")}
              color="#1976D2"
            />
          </div>
          <div className="w-full min-h-0 flex flex-col flex-1 p-4 gap-4 border-2 border-[#b3b3b3] rounded-[10px] bg-white">
            <p className="font-semibold"> {t("products.table1")}</p>
            <DataTableSearch
              data={dataProducts}
              columns={columnsp}
              actions={{
                view: false,
                edit: true,
                delete: true,
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
