import React, { useEffect, useState } from "react";
import CardInfoNumber from "@components/CardInfoNumber";
import BoxIcon from "@icons/BoxIcon";
import ShoppingCar from "@icons/ShoppingCar";
import ChartPieDonutText from "@components/chart-pie-donut";
import { addRandomFill } from "@/utility/addFill";
import ChartBarLabel from "@components/char-bar-label";
import { DataTable } from "@components/data-table";
import { columnsS } from "@columns/columnsS";
import type { Sales } from "@typesm/sales";

interface PieChartItem {
  fill: string;
  [key: string]: string | number;
}
interface BarChartItem {
  [key: string]: string | number;
}

//* Example data pie chart
const chartDataCSDB = [
  { category: "Maquillaje", sales: 10 },
  { category: "Dulces", sales: 20 },
  { category: "Edredones", sales: 87 },
  { category: "Zapatos", sales: 73 },
];

const chartConfigCS = {
  sales: {
    label: "Sales",
  },
};

//* Example data bar chart
const chartDataTCSDB = [
  { category: "Maquillaje", sales: 186 },
  { category: "Regalos", sales: 305 },
  { category: "Edredones", sales: 237 },
  { category: "Dulces", sales: 73 },
  { category: "Zapatos", sales: 209 },
];

const chartConfigTCS = {
  sales: {
    label: "Sales",
    color: "#1976D2",
  },
};

//* Example data table
const dataSBD = [
  {
    id: "728ed51f",
    name: "Eric",
    last_name: "Villeda",
    code_sku: "ASD2344",
    product: "Carrito 12",
    category: "Maquillaje",
    ccolor: "#5b49ff",
    total_amount: 100,
    paid_amount: 100,
    status: "paid",
    created_at: "16/11/2025",
  },
  {
    id: "728ed51f",
    name: "",
    last_name: "",
    code_sku: "ASD2344",
    product: "Carrito 12",
    category: "Maquillaje",
    ccolor: "#5b49ff",
    total_amount: 100,
    paid_amount: 100,
    status: "paid",
    created_at: "16/11/2025",
  },
];

interface ReportsSalesProps {}

const ReportsSales: React.FC<ReportsSalesProps> = ({}) => {
  const [chartDataCSF, setChartDataCSF] = useState<PieChartItem[]>([]);
  const [chartDataTCS, setChartDataTSC] = useState<BarChartItem[]>([]);
  const [dataTableS, setDataTableS] = useState<Sales[]>([]);

  useEffect(() => {
    setChartDataCSF(addRandomFill(chartDataCSDB));
    setChartDataTSC(chartDataTCSDB);
    setDataTableS(dataSBD);
  }, []);

  return (
    <>
      <div className="w-full h-full flex flex-col gap-2">
        <div className="flex gap-2 h-[110px] overflow-x-auto overflow-y-hidden">
          <CardInfoNumber
            icon={BoxIcon}
            title="Inventory value"
            icond={null}
            number={100000}
            format={true}
            color="#FFC107"
          />
          <CardInfoNumber
            icon={ShoppingCar}
            title="Sales: 10"
            icond={null}
            number={1500}
            format={true}
            color="#1976D2"
          />
        </div>
        <div className="w-full h-auto flex-1 flex flex-col overflow-y-auto gap-2">
          <div className="w-full flex gap-2 h-[280px]">
            <div className="max-w-[300px] min-w-0 w-full h-full flex flex-col justify-center items-center p-5 gap-5 border-2 border-[#b3b3b3] rounded-[10px] bg-white">
              <p className="font-semibold">Categories Sales</p>
              <ChartPieDonutText
                chartData={chartDataCSF}
                chartConfig={chartConfigCS}
              />
            </div>
            <div className="max-w-[600px] min-w-[400px] w-[600px] h-full flex flex-col justify-center items-start p-5 gap-5 border-2 border-[#b3b3b3] rounded-[10px] bg-white">
              <p className="font-semibold mb-2">Sales by Category</p>
              <ChartBarLabel
                chartData={chartDataTCS}
                chartConfig={chartConfigTCS}
                xAxis="category"
                yAxis="sales"
              />
            </div>
          </div>
          <div className="w-full h-[500px] p-4 gap-1 border-2 border-[#b3b3b3] rounded-[10px] bg-white flex flex-col">
            <p className="font-semibold mb-2">Sales</p>
            <DataTable
              columns={columnsS}
              data={dataTableS}
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

export default ReportsSales;
