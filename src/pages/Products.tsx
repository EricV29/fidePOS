import React from "react";
import { useState, useEffect } from "react";
import ExportIcon from "@/assets/icons/ExportIcon";
import ImportIcon from "@/assets/icons/ImportIcon";
import CategoryIcon from "@/assets/icons/CategoryIcon";
import PlusIcon from "@/assets/icons/PlusIcon";
import InvestmentIcon from "@/assets/icons/InvestmentIcon";
import RevenueIcon from "@/assets/icons/RevenueIcon";
import CardInfo from "../components/CardInfo";
import CardInfoDetail from "../components/CardInfoDetail";
import { DataTableSearch } from "@/components/data-table-search";
import { columnsP } from "@/components/columns/columnsP";

interface dataStockI {
  [key: string]: number;
}

export type dataProductI = {
  id: string;
  code_sku: string;
  name: string;
  description: string;
  category: string;
  ccolor: string;
  cost_price: number;
  unit_price: number;
  stock: number;
  status: string;
  created_at: string;
  actions?: {
    view?: boolean;
    delete?: boolean;
    edit?: boolean;
  };
};

//* Example data stock products
const dataStockDB = { Stock: 100, "Out Stock": 40 };

//* Example data products
const dataProductsDB = [
  {
    id: "34234",
    code_sku: "JW0012",
    name: "Labial",
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
    name: "Carrito",
    description: "hotweels",
    category: "Toys",
    ccolor: "#ff49ff",
    cost_price: 12000,
    unit_price: 30000,
    stock: 2,
    status: "inactive",
    created_at: "01/10/2025",
  },
  {
    id: "34235",
    code_sku: "JW0014",
    name: "Edredon 2",
    description: "osito",
    category: "Toys",
    ccolor: "#ff49ff",
    cost_price: 13000,
    unit_price: 10000,
    stock: 3,
    status: "inactive",
    created_at: "01/03/2025",
  },
];

interface ProductsProps {}

const Products: React.FC<ProductsProps> = ({}) => {
  const [dataStock, setStock] = useState<dataStockI>();
  const [dataProducts, setProducts] = useState<dataProductI[]>([]);

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
          <div className="w-full h-fit flex justify-between gap-2">
            <CardInfo
              icon={InvestmentIcon}
              title="Investment"
              icond={null}
              number={100000}
              color="#F57C00"
            />

            <CardInfo
              icon={RevenueIcon}
              title="Inventory Value"
              icond={null}
              number={100000}
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
