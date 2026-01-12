import React, { useEffect, useState } from "react";
import CardInfoNumber from "@components/CardInfoNumber";
import BoxIcon from "@icons/BoxIcon";
import ShoppingCar from "@icons/ShoppingCar";
import ChartPieDonutText from "@components/chart-pie-donut";
import { addRandomFill } from "@utility/AddFill";
import ChartBarLabel from "@components/char-bar-label";
import { DataTable } from "@components/data-table";
import { columnsS } from "@columns/columnsS";
import type { Sales } from "@typesm/sales";
import { useTranslation } from "react-i18next";

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

//* Example data bar chart
const chartDataTCSDB = [
  { category: "Maquillaje", sales: 186 },
  { category: "Regalos", sales: 305 },
  { category: "Edredones", sales: 237 },
  { category: "Dulces", sales: 73 },
  { category: "Zapatos", sales: 209 },
];

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
    created_at: "2025-02-15 00:00:00",
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
    status: "unpaid",
    created_at: "2025-02-15 00:00:00",
  },
];

interface ReportsSalesProps {}

const ReportsSales: React.FC<ReportsSalesProps> = ({}) => {
  const [chartDataCSF, setChartDataCSF] = useState<PieChartItem[]>([]);
  const [chartDataTCS, setChartDataTSC] = useState<BarChartItem[]>([]);
  const [dataTableS, setDataTableS] = useState<Sales[]>([]);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    setChartDataCSF(addRandomFill(chartDataCSDB));
    setChartDataTSC(chartDataTCSDB);
    setDataTableS(dataSBD);
  }, []);

  const columnss = columnsS(t, i18n.language);

  const chartConfigCS = {
    items: {
      label: t("charts.chart_cs"),
    },
  };

  const chartConfigTCS = {
    sales: {
      label: t("charts.chart_tcs"),
      color: "#1976D2",
    },
  };

  return (
    <>
      <div className="w-full h-full flex flex-col gap-2">
        <div className="flex gap-2 h-[110px] overflow-x-auto overflow-y-hidden">
          <CardInfoNumber
            icon={BoxIcon}
            title={t("cards.inventory_value_title")}
            icond={null}
            number={100000}
            format={true}
            color="#FFC107"
          />
          <CardInfoNumber
            icon={ShoppingCar}
            title={t("cards.sales_title") + ": 10"}
            icond={null}
            number={1500}
            format={true}
            color="#1976D2"
          />
        </div>
        <div className="w-full h-auto flex-1 flex flex-col overflow-y-auto gap-2">
          <div className="w-full flex gap-2 h-[280px]">
            <div className="max-w-[300px] min-w-0 w-full h-full flex flex-col justify-center items-center p-5 gap-5 border-2 border-[#b3b3b3] rounded-[10px] bg-transparent">
              <p className="font-semibold dark:text-white">
                {t("reports.chart1")}
              </p>
              <ChartPieDonutText
                chartData={chartDataCSF}
                chartConfig={chartConfigCS}
              />
            </div>
            <div className="max-w-[600px] min-w-[400px] w-[600px] h-full flex flex-col justify-center items-start p-5 gap-5 border-2 border-[#b3b3b3] rounded-[10px] bg-transparent">
              <p className="font-semibold mb-2 dark:text-white">
                {t("reports.chart2")}
              </p>
              <ChartBarLabel
                chartData={chartDataTCS}
                chartConfig={chartConfigTCS}
                xAxis="category"
                yAxis="sales"
              />
            </div>
          </div>
          <div className="w-full h-[500px] p-4 gap-1 border-2 border-[#b3b3b3] rounded-[10px] bg-transparent flex flex-col">
            <p className="font-semibold mb-2 dark:text-white">
              {t("reports.table2")}
            </p>
            <DataTable columns={columnss} data={dataTableS} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ReportsSales;
