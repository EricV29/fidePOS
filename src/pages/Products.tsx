import React from "react";
import { useState, useEffect } from "react";
import ExportIcon from "@icons/ExportIcon";
import ImportIcon from "@icons/ImportIcon";
import CategoryIcon from "@icons/CategoryIcon";
import PlusIcon from "@icons/PlusIcon";
import InvestmentIcon from "@icons/InvestmentIcon";
import RevenueIcon from "@icons/RevenueIcon";
import CardInfoNumber from "@components/CardInfoNumber";
import CardInfoDetail from "@components/CardInfoDetail";
import { DataTableSearch } from "@components/data-table-search";
import { columnsP } from "@columns/columnsP";
import type { Products } from "@typesm/products";

interface dataStockI {
  [key: string]: number;
}

//* Example data stock products
const dataStockDB = { Stock: 100, "Out Stock": 40 };

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

interface ProductsProps {}

const Products: React.FC<ProductsProps> = ({}) => {
  const [dataStock, setStock] = useState<dataStockI>();
  const [dataProducts, setProducts] = useState<Products[]>([]);

  useEffect(() => {
    setStock(dataStockDB);
    setProducts(dataProductsDB);
  }, []);

  return (
    <>
      <div className="w-full h-full flex flex-col min-h-0">
        <div className="w-full h-fit flex justify-between items-end">
          <h1 style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.25rem)" }}>
            Products Inventory
          </h1>
          <div className="flex gap-2">
            <button className="bnormal">
              <ExportIcon /> <p>Export</p>
            </button>
            <button className="bnormal">
              <ImportIcon /> <p>Import</p>
            </button>
            <button className="bnormal">
              <PlusIcon /> <p>Product</p>
            </button>
            <button className="bnormal">
              <CategoryIcon /> <p>Category</p>
            </button>
          </div>
        </div>
        <hr className="border border-[#b3b3b3] my-2" />
        <div className="flex-1 min-h-0 w-full flex flex-col gap-2">
          <div className="w-full h-[120px] flex justify-between gap-2">
            <CardInfoNumber
              icon={InvestmentIcon}
              title="Investment"
              icond={null}
              number={100000}
              format={true}
              color="#F57C00"
            />

            <CardInfoNumber
              icon={RevenueIcon}
              title="Inventory Value"
              icond={null}
              number={100000}
              format={true}
              color="#FFC107"
            />
            <CardInfoDetail
              chartData={dataStock!}
              title={"Products"}
              color="#1976D2"
            />
          </div>
          <div className="w-full min-h-0 flex flex-col flex-1 p-4 gap-4 border-2 border-[#b3b3b3] rounded-[10px] bg-white">
            <p className="font-semibold">Inventory Table</p>
            <DataTableSearch
              data={dataProducts}
              columns={columnsP}
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
};

export default Products;
