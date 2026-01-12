import React, { useEffect, useState } from "react";
import CardInfoNumber from "@components/CardInfoNumber";
import CardInfoDetail from "@components/CardInfoDetail";
import InvestmentIcon from "@icons/InvestmentIcon";
import ShoppingCar from "@icons/ShoppingCar";
import RevenueIcon from "@icons/RevenueIcon";
import ChartPieDonutText from "@components/chart-pie-donut";
import { addRandomFill } from "@/utility/addFill";
import ChartBarLabel from "@components/char-bar-label";
import { DataTable } from "@components/data-table";
import { columnsAR } from "@columns/columnsAR";
import { useTranslation } from "react-i18next";

interface dataCustomerI {
  [key: string]: number;
}

interface PieChartItem {
  fill: string;
  [key: string]: string | number;
}
interface BarChartItem {
  [key: string]: string | number;
}

export type AccountsReceivable = {
  id: string;
  name: string;
  last_name: string;
  code_sku: string;
  debt_amount: number;
  debt_paid: number;
  debt_pending: number;
  created_at: string;
  actions?: {
    view?: boolean;
    delete?: boolean;
    edit?: boolean;
  };
};

export type RecentSalesPaid = {
  id: string;
  date: string;
  category: string;
  amount: number;
  actions?: {
    view?: boolean;
    delete?: boolean;
    edit?: boolean;
  };
};

interface ReportsGeneralProps {}

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

//* Example data stock products
const dataCustomerDB = { Total: 40, "In Debt": 15 };

//* Example data status products
const dataStatusPSDB = { Active: 40, Desactive: 15 };

//* Example data accounts receivable
const dataARBD = [
  {
    id: "728ed511f",
    name: "Eric",
    last_name: "Villeda",
    code_sku: "SAD2435",
    debt_amount: 500,
    debt_paid: 200,
    debt_pending: 300,
    created_at: "2025-02-15 00:00:00",
  },
];

const ReportsGeneral: React.FC<ReportsGeneralProps> = ({}) => {
  const [dataCustomer, setCustomer] = useState<dataCustomerI>();
  const [dataProductsS, setDataProductsS] = useState<dataCustomerI>();
  const [chartDataCSF, setChartDataCSF] = useState<PieChartItem[]>([]);
  const [chartDataTCS, setChartDataTSC] = useState<BarChartItem[]>([]);
  const [dataTableAR, setDataTableAR] = useState<AccountsReceivable[]>([]);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    setCustomer(dataCustomerDB);
    setDataProductsS(dataStatusPSDB);
    setChartDataCSF(addRandomFill(chartDataCSDB));
    setChartDataTSC(chartDataTCSDB);
    setDataTableAR(dataARBD);
  }, []);

  const columnsar = columnsAR(t, i18n.language);

  const chartConfigCS = {
    items: {
      label: t("charts.chart_tcs"),
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
            icon={InvestmentIcon}
            title={t("cards.investment_title")}
            icond={null}
            number={120238}
            format={true}
            color="#F57C00"
          />
          <CardInfoNumber
            icon={RevenueIcon}
            title={t("cards.revenue_title")}
            icond={null}
            number={10500}
            format={true}
            color="#43A047"
          />
          <CardInfoNumber
            icon={InvestmentIcon}
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
          <CardInfoNumber
            icon={InvestmentIcon}
            title={t("cards.owed_title")}
            icond={null}
            number={12000}
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
            <div className="flex flex-1 flex-col justify-between">
              <CardInfoDetail
                chartData={dataCustomer!}
                title={t("cards.customers_title")}
                color="#1976D2"
              />

              <CardInfoDetail
                chartData={dataProductsS!}
                title={t("cards.products_status_title")}
                color="#1976D2"
              />
            </div>
          </div>
          <div className="w-full h-[500px] p-4 gap-1 border-2 border-[#b3b3b3] rounded-[10px] bg-transparent flex flex-col">
            <p className="font-semibold mb-2 dark:text-white">
              Accounts Receivable
            </p>
            <DataTable columns={columnsar} data={dataTableAR} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ReportsGeneral;
