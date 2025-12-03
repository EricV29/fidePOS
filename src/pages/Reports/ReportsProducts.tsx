import React, { useEffect, useState } from "react";
import CardInfoNumber from "@/components/CardInfoNumber";
import InvestmentIcon from "@/assets/icons/InvestmentIcon";
import RevenueIcon from "@/assets/icons/RevenueIcon";
import ChartPieDonutText from "@/components/pie-chart";
import { addRandomFill } from "../../utility/AddFill";
import BarChartEx from "@/components/bar-chart";
import { DataTable } from "@/components/data-table";
import { columnsAP } from "@/components/columns/columnsAP";
import CardInfoDetail from "@/components/CardInfoDetail";

interface PieChartItem {
  fill: string;
  [key: string]: string | number;
}
interface BarChartItem {
  [key: string]: string | number;
}

export type Sales = {
  id: string;
  created_at: string;
  category: string;
  ccolor: string;
  stock: number;
  last_sale: string;
  actions?: {
    view?: boolean;
    delete?: boolean;
    edit?: boolean;
  };
};

//* Example data pie chart
const chartDataCPDB = [
  { category: "Maquillaje", products: 10 },
  { category: "Dulces", products: 20 },
  { category: "Edredones", products: 87 },
  { category: "Zapatos", products: 73 },
];

const chartConfigCP = {
  products: {
    label: "Products",
  },
};

//* Example data bar chart
const chartDataTSPDB = [
  { product: "Edredon 2", sales: 86 },
  { product: "Bota azul", sales: 35 },
  { product: "Bolsa roja", sales: 37 },
  { product: "Mazapan", sales: 73 },
  { product: "Labial yuya", sales: 29 },
];

const chartConfigTSP = {
  sales: {
    label: "Sales",
    color: "#1976D2",
  },
};

//* Example data table
const dataAPBD = [
  {
    id: "728ed51f",
    created_at: "16/11/2025",
    category: "Maquillaje",
    ccolor: "#5b49ff",
    stock: 10,
    last_sale: "16/11/2025",
  },
];

//* Example data status products
const dataStatusPDB = { Active: 40, Desactive: 15 };

interface ReportsProductsProps {}

const ReportsProducts: React.FC<ReportsProductsProps> = ({}) => {
  const [chartDataCP, setChartDataCP] = useState<PieChartItem[]>([]);
  const [chartDataTSP, setChartDataTSP] = useState<BarChartItem[]>([]);
  const [dataTableAP, setDataTableAP] = useState<Sales[]>([]);

  useEffect(() => {
    setChartDataCP(addRandomFill(chartDataCPDB));
    setChartDataTSP(chartDataTSPDB);
    setDataTableAP(dataAPBD);
  }, []);
  return (
    <>
      <div className="w-full h-full flex flex-col gap-2">
        <div className="flex gap-2 h-[110px] overflow-x-auto overflow-y-hidden">
          <CardInfoNumber
            icon={InvestmentIcon}
            title="Investment"
            icond={null}
            number={120238}
            format={true}
            color="#F57C00"
          />
          <CardInfoNumber
            icon={RevenueIcon}
            title="Revenue"
            icond={null}
            number={10500}
            format={true}
            color="#43A047"
          />
          <CardInfoNumber
            icon={InvestmentIcon}
            title="Inventory value"
            icond={null}
            number={100000}
            format={true}
            color="#FFC107"
          />
        </div>
        <div className="w-full h-auto flex-1 flex flex-col overflow-y-auto gap-2">
          <div className="w-full flex gap-2 h-[280px]">
            <div className="max-w-[300px] min-w-0 w-full h-full flex flex-col justify-center items-center p-5 gap-5 border-2 border-[#b3b3b3] rounded-[10px] bg-white">
              <p className="font-semibold">Categories Products</p>
              <ChartPieDonutText
                chartData={chartDataCP}
                chartConfig={chartConfigCP}
              />
            </div>
            <div className="max-w-[600px] min-w-[400px] w-[600px] h-full flex flex-col justify-center items-start p-5 gap-5 border-2 border-[#b3b3b3] rounded-[10px] bg-white">
              <p className="font-semibold mb-2">Top Selling Products</p>
              <BarChartEx
                chartData={chartDataTSP}
                chartConfig={chartConfigTSP}
                xAxis="product"
                yAxis="sales"
              />
            </div>
            <div className="flex flex-1 flex-col justify-between">
              <CardInfoDetail
                chartData={dataStatusPDB!}
                title={"Products (active/desactive)"}
                color="#1976D2"
              />
            </div>
          </div>
          <div className="w-full h-[500px] p-4 gap-1 border-2 border-[#b3b3b3] rounded-[10px] bg-white flex flex-col">
            <p className="font-semibold mb-2">Sales</p>
            <DataTable
              columns={columnsAP}
              data={dataTableAP}
              actions={{
                view: true,
                edit: false,
                delete: false,
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ReportsProducts;
