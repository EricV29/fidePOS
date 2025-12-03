import React, { useEffect, useState } from "react";
import CardInfoNumber from "@/components/CardInfoNumber";
import ChartPieDonutText from "@/components/pie-chart";
import { addRandomFill } from "../../utility/AddFill";
import { DataTable } from "@/components/data-table";
import { columnsCc } from "@/components/columns/columnsC";
import { columnsC } from "@/components/columns/columnsC";
import CardInfoDetail from "@/components/CardInfoDetail";
import { DataTableSearch } from "@/components/data-table-search";
import CustomSelect from "@/components/Select";
import ChartAreaDefault from "@/components/chart-area";

interface PieChartItem {
  fill: string;
  [key: string]: string | number;
}

export type Customers = {
  id: string;
  name: string;
  last_name: string;
  phone: string;
  status: string;
  debts: number;
  debts_amount: number;
  debts_paid: number;
  created_at: string;
  actions?: {
    view?: boolean;
    delete?: boolean;
    edit?: boolean;
  };
};

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

const chartConfigDDC = {
  debts: {
    label: "Debts",
  },
};

//* Example data table
const dataCBD = [
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

const dataPaymentsDB = [
  {
    id: "34234",
    name: "Eric",
    last_name: "Villeda",
    phone: "7713940793",
    status: "active",
    created_at: "01/01/2025",
  },
  {
    id: "34234",
    name: "Eric",
    last_name: "Reyes",
    phone: "7713940793",
    status: "debt",
    created_at: "01/01/2025",
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

const chartConfigTDOT = {
  debts: {
    label: "Debts",
    color: "#F57C00",
  },
};

interface ReportsCustomersProps {}

const ReportsCustomers: React.FC<ReportsCustomersProps> = ({}) => {
  const [chartDataDDC, setChartDataDDC] = useState<PieChartItem[]>([]);
  const [dataTableC, setDataTableC] = useState<Customers[]>([]);
  const [dataPayment, setPayment] = useState<dataPaymentI[]>([]);

  useEffect(() => {
    setChartDataDDC(addRandomFill(chartDataDDCDB));
    setDataTableC(dataCBD);
    setPayment(dataPaymentsDB);
  }, []);

  return (
    <>
      <div className="w-full h-full flex flex-col gap-2">
        <div className="flex gap-2 h-[110px] overflow-x-auto overflow-y-hidden">
          <CardInfoNumber
            icon={null}
            title="Owed"
            icond={null}
            number={12000}
            format={true}
            color="#1976D2"
          />
          <CardInfoNumber
            icon={null}
            title="Sales: 10"
            icond={null}
            number={1500}
            format={true}
            color="#1976D2"
          />
          <CardInfoDetail
            chartData={dataCustomersSDB!}
            title={"Customers"}
            color="#1976D2"
          />
        </div>
        <div className="w-full h-auto flex-1 flex flex-col overflow-y-auto gap-2">
          <div className="w-full flex gap-2 h-[280px]">
            <div className="max-w-[300px] min-w-0 w-full h-full flex flex-col justify-center items-center p-5 gap-5 border-2 border-[#b3b3b3] rounded-[10px] bg-white">
              <p className="font-semibold">Debt Distribution by Customers</p>
              <ChartPieDonutText
                chartData={chartDataDDC}
                chartConfig={chartConfigDDC}
              />
            </div>
            <div className=" min-w-0 w-full h-full flex flex-col justify-center items-center p-5 gap-5 border-2 border-[#b3b3b3] rounded-[10px] bg-white">
              <p className="font-semibold">Total Debt Over Time</p>
              <ChartAreaDefault
                chartData={chartDataTDOT}
                chartConfig={chartConfigTDOT}
              />
            </div>
          </div>
          <div className="w-full h-[500px] p-4 gap-1 border-2 border-[#b3b3b3] rounded-[10px] bg-white flex flex-col">
            <p className="font-semibold mb-2">Customers</p>
            <DataTable
              columns={columnsCc}
              data={dataTableC}
              actions={{
                view: true,
                edit: false,
                delete: false,
              }}
            />
          </div>
          <CustomSelect
            options={optionsCustomers}
            placeholder="Select your customer"
          />
          <div className="w-full min-w-0 flex gap-2">
            <div className="w-1/2 min-h-0 min-w-0 flex flex-col flex-1 p-4 gap-4 border-2 border-[#b3b3b3] rounded-[10px] bg-white">
              <p className="font-semibold">Debts Table</p>
              <DataTableSearch
                data={dataPayment}
                columns={columnsC}
                actions={{
                  view: true,
                  edit: true,
                  delete: true,
                }}
              />
            </div>
            <div className="w-1/2 min-h-0 min-w-0 flex flex-col flex-1 p-4 gap-4 border-2 border-[#b3b3b3] rounded-[10px] bg-white">
              <p className="font-semibold">Payments Table</p>
              <DataTableSearch
                data={dataPayment}
                columns={columnsC}
                actions={{
                  view: true,
                  edit: true,
                  delete: true,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReportsCustomers;
