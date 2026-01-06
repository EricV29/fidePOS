import React, { useEffect, useState } from "react";
import CardInfoNumber from "@components/CardInfoNumber";
import ChartPieDonutText from "@components/chart-pie-donut";
import { addRandomFill } from "@/utility/addFill";
import { DataTable } from "@components/data-table";
import { columnsC } from "@columns/columnsC";
import type { Customers } from "@typesm/customers";
import { columnsDC } from "@columns/columnsDC";
import type { DebtsCustomer } from "@typesm/customers";
import { columnsPC } from "@columns/columnsPC";
import type { PaymentsCustomer } from "@typesm/customers";
import CardInfoDetail from "@components/CardInfoDetail";
import { DataTableSearch } from "@components/data-table-search";
import CustomSelect from "@components/Select";
import ChartAreaDefault from "@components/chart-area-default";
import InvestmentIcon from "@icons/InvestmentIcon";
import ShoppingCar from "@icons/ShoppingCar";
import { useTranslation } from "react-i18next";

interface PieChartItem {
  fill: string;
  [key: string]: string | number;
}

export type dataPaymentI = {
  id: string;
  name: string;
  last_name: string;
  phone: string;
  status: string;
  created_at: string;
  actions?: {
    view?: boolean;
    delete?: boolean;
    edit?: boolean;
  };
};

//* Example data pie chart
const chartDataDDCDB = [
  { customer: "Eric", debts: 2 },
  { customer: "Jared", debts: 1 },
  { customer: "Wendy", debts: 3 },
  { customer: "Lucy", debts: 2 },
];

//* Example data table

const dataCustomersDB = [
  {
    id: "728ed51f",
    name: "Eric",
    last_name: "Villeda",
    phone: "7713940793",
    status: "active",
    debts: 0,
    debts_amount: 0,
    debts_paid: 500,
    created_at: "03/03/2025",
  },
];

const dataCBD = [
  {
    id: "34234",
    code_sku: "ASD345",
    product: "Carrito",
    description: "Hotweels rojo",
    category: "toys",
    ccolor: "#ff49ff",
    status: "unpaid",
    debt_amount: 100,
    debt_paid: 50,
    created_at: "01/02/2025",
  },
  {
    id: "34234",
    code_sku: "ASD345",
    product: "Muñeco",
    description: "Max Steel",
    category: "toys",
    ccolor: "#ff49ff",
    status: "paid",
    debt_amount: 100,
    debt_paid: 100,
    created_at: "01/02/2025",
  },
];

const dataPaymentsDB = [
  {
    id: "34234",
    created_at: "01/01/2025",
    code_sku: "SFAS34",
    product: "Carrito2",
    note: "La siguiente semana liquida",
    amount: 40,
  },
];

//* Example data status products
const dataCustomersSDB = { Total: 40, "In Debt": 15 };

const optionsCustomers = [
  { label: "Eric Villeda Reyes", value: "idcustomer1" },
  { label: "Jared Villeda Reyes", value: "idcustomer2" },
];

//* Example data chart AREA
const chartDataTDOT = [
  { month: "January", debts: 4 },
  { month: "February", debts: 5 },
  { month: "March", debts: 7 },
  { month: "April", debts: 3 },
  { month: "May", debts: 9 },
  { month: "June", debts: 4 },
];

interface ReportsCustomersProps {}

const ReportsCustomers: React.FC<ReportsCustomersProps> = ({}) => {
  const [chartDataDDC, setChartDataDDC] = useState<PieChartItem[]>([]);
  const [dataTableC, setDataTableC] = useState<Customers[]>([]);
  const [dataTableDC, setDataTableDC] = useState<DebtsCustomer[]>([]);
  const [dataTablePC, setDataTablePC] = useState<PaymentsCustomer[]>([]);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    setChartDataDDC(addRandomFill(chartDataDDCDB));
    setDataTableC(dataCustomersDB);
    setDataTableDC(dataCBD);
    setDataTablePC(dataPaymentsDB);
  }, []);

  const columnsc = columnsC(t, i18n.language);
  const columnsdc = columnsDC(t, i18n.language);
  const columnspc = columnsPC(t, i18n.language);

  const chartConfigDDC = {
    items: {
      label: t("placeholders.debt"),
    },
  };

  const chartConfigTDOT = {
    debts: {
      label: t("placeholders.debt"),
      color: "#F57C00",
    },
  };

  return (
    <>
      <div className="w-full h-full flex flex-col gap-2">
        <div className="flex gap-2 h-[110px] overflow-x-auto overflow-y-hidden">
          <CardInfoNumber
            icon={InvestmentIcon}
            title={t("cards.owed_title")}
            icond={null}
            number={12000}
            format={true}
            color="#1976D2"
          />
          <CardInfoNumber
            icon={ShoppingCar}
            title={t("cards.sales_title") + ": 10"}
            icond={null}
            number={1500}
            format={true}
            color="#1976D2"
          />
          <CardInfoDetail
            chartData={dataCustomersSDB!}
            title={t("cards.customers_title")}
            color="#1976D2"
          />
        </div>
        <div className="w-full h-auto flex-1 flex flex-col overflow-y-auto gap-2">
          <div className="w-full flex gap-2 h-[280px]">
            <div className="max-w-[300px] min-w-0 w-full h-full flex flex-col justify-center items-center p-5 gap-5 border-2 border-[#b3b3b3] rounded-[10px] bg-white">
              <p className="font-semibold">{t("reports.chart5")}</p>
              <ChartPieDonutText
                chartData={chartDataDDC}
                chartConfig={chartConfigDDC}
              />
            </div>
            <div className=" min-w-0 w-full h-full flex flex-col justify-center items-center p-5 gap-5 border-2 border-[#b3b3b3] rounded-[10px] bg-white">
              <p className="font-semibold">{t("reports.chart6")}</p>
              <ChartAreaDefault
                chartData={chartDataTDOT}
                chartConfig={chartConfigTDOT}
              />
            </div>
          </div>
          <div className="w-full h-[500px] p-4 gap-1 border-2 border-[#b3b3b3] rounded-[10px] bg-white flex flex-col">
            <p className="font-semibold mb-2">{t("reports.table4")}</p>
            <DataTable columns={columnsc} data={dataTableC} />
          </div>
          <CustomSelect
            options={optionsCustomers}
            placeholder={t("reports.input1")}
            color="#F57C00"
          />
          <div className="w-full min-w-0 flex gap-2">
            <div className="w-1/2 min-h-0 min-w-0 flex flex-col flex-1 p-4 gap-4 border-2 border-[#b3b3b3] rounded-[10px] bg-white">
              <p className="font-semibold">{t("reports.table5")}</p>
              <DataTableSearch data={dataTableDC} columns={columnsdc} />
            </div>
            <div className="w-1/2 min-h-0 min-w-0 flex flex-col flex-1 p-4 gap-4 border-2 border-[#b3b3b3] rounded-[10px] bg-white">
              <p className="font-semibold">{t("reports.table6")}</p>
              <DataTableSearch data={dataTablePC} columns={columnspc} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReportsCustomers;
