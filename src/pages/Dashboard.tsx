import { useEffect, useState } from "react";
import DatePicker from "@components/DatePicker";
import CardInfoNumber from "@components/CardInfoNumber";
import RevenueIcon from "@icons/RevenueIcon";
import InvestmentIcon from "@icons/InvestmentIcon";
import ChartBarLabel from "@components/char-bar-label";
import ChartPieDonutText from "@components/chart-pie-donut";
import { DataTable } from "@components/data-table";
import { columnsRSP } from "@columns/columnsRSP";
import type { RecentSalesPaid } from "@typesm/sales";
import { columnsAR } from "@columns/columnsAR";
import type { AccountsReceivable } from "@typesm/accounts";
import { addRandomFill } from "@utility/AddFill";
import { useInstallDate } from "@hooks/useInstallDate";

interface BarChartItem {
  [key: string]: string | number;
}

interface PieChartItem {
  fill: string;
  [key: string]: string | number;
}

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
    color: "#F57C00",
  },
};

//* Example data pie chart
const chartDataTAPCDB = [
  { category: "Maquillaje", products: 275 },
  { category: "Dulces", products: 200 },
  { category: "Edredones", products: 287 },
  { category: "Zapatos", products: 173 },
];

const chartConfigTAPC = {
  products: {
    label: "Products",
  },
};

//* Example data cards
const dataRevenueBD = 100000;
const dataInvestBD = 12238;

//* Example data tables
const dataRSPBD = [
  {
    id: "728ed51f",
    created_at: "16/11/2025",
    category: "Maquillaje",
    ccolor: "#5b49ff",
    total_amount: 100,
  },
  {
    id: "728ed52f",
    created_at: "16/11/2025",
    category: "toys",
    ccolor: "#ff49ff",
    total_amount: 50,
  },
  {
    id: "728ed52f",
    created_at: "16/11/2025",
    category: "toys",
    ccolor: "#ff49ff",
    total_amount: 50,
  },
  {
    id: "728ed52f",
    created_at: "16/11/2025",
    category: "toys",
    ccolor: "#ff49ff",
    total_amount: 50,
  },
  {
    id: "728ed52f",
    created_at: "16/11/2025",
    category: "toys",
    ccolor: "#ff49ff",
    total_amount: 50,
  },
  {
    id: "728ed52f",
    created_at: "16/11/2025",
    category: "toys",
    ccolor: "#ff49ff",
    total_amount: 50,
  },
];

const dataARBD = [
  {
    id: "728ed511f",
    name: "Eric",
    last_name: "Villeda",
    code_sku: "SAD2435",
    debt_amount: 500,
    debt_paid: 200,
    debt_pending: 300,
    created_at: "01/01/2025",
  },
];

export default function Dashboard() {
  const { installDate } = useInstallDate();
  const [chartDataTCS, setChartDataTSC] = useState<BarChartItem[]>([]);
  const [chartDataTAPCF, setChartDataTAPCF] = useState<PieChartItem[]>([]);
  const [revenueCard, setRevenueCard] = useState(Number);
  const [investCard, setInvestCard] = useState(Number);
  const [dataTableRSP, setDataTableRSP] = useState<RecentSalesPaid[]>([]);
  const [dataTableAR, setDataTableAR] = useState<AccountsReceivable[]>([]);

  useEffect(() => {
    setChartDataTSC(chartDataTCSDB);
    setChartDataTAPCF(addRandomFill(chartDataTAPCDB));
    setRevenueCard(dataRevenueBD);
    setInvestCard(dataInvestBD);
    setDataTableRSP(dataRSPBD);
    setDataTableAR(dataARBD);
    loadRoles();
  }, []);

  async function loadRoles() {
    const roles = await window.electronAPI.getRoles();
    console.log(roles);
  }

  if (!installDate) return null;

  return (
    <>
      <div className="w-full h-full flex flex-col min-h-0">
        <div className="w-full h-fit flex justify-between items-end">
          <h1 className="text-[30px]">Dashboard</h1>
          <DatePicker installDate={installDate} />
        </div>
        <hr className="border border-[#b3b3b3] my-2" />
        <div className="flex-1 min-h-0 w-full flex flex-col">
          <div className="h-fit p-2">
            <div className="h-[35vh] w-full flex justify-between gap-2 min-w-0">
              <div className="max-w-[600px] min-w-0 w-[600px] h-full flex flex-col justify-center items-start p-5 gap-5 border-2 border-[#b3b3b3] rounded-[10px] bg-white">
                <p className="font-semibold mb-2">Top 5 - Sales by Category</p>
                <ChartBarLabel
                  chartData={chartDataTCS}
                  chartConfig={chartConfigTCS}
                  xAxis="category"
                  yAxis="sales"
                />
              </div>
              <div className="max-w-[300px] min-w-0 h-full flex flex-col justify-center items-center p-5 gap-5 border-2 border-[#b3b3b3] rounded-[10px] bg-white">
                <p className="font-semibold">
                  Total Active Products Categories
                </p>
                <ChartPieDonutText
                  chartData={chartDataTAPCF}
                  chartConfig={chartConfigTAPC}
                />
              </div>
              <div className="max-w-[300px] min-w-0 w-[300px] h-full flex flex-col gap-2 justify-between items-center">
                <CardInfoNumber
                  icon={RevenueIcon}
                  title="Revenue"
                  icond={null}
                  number={revenueCard}
                  format={true}
                  color="#43A047"
                />
                <CardInfoNumber
                  icon={InvestmentIcon}
                  title="Investment"
                  icond={null}
                  number={investCard}
                  format={true}
                  color="#F57C00"
                />
              </div>
            </div>
          </div>
          <div className="flex-1 min-h-0 p-2 flex gap-2">
            <div className="w-1/2 h-full min-h-0 p-4 gap-1 border-2 border-[#b3b3b3] rounded-[10px] bg-white flex flex-col">
              <p className="font-semibold mb-2">Recent Sales Paid</p>
              <DataTable
                columns={columnsRSP}
                data={dataTableRSP}
                actions={{
                  view: true,
                  edit: false,
                  delete: false,
                }}
              />
            </div>
            <div className="w-1/2 h-full min-h-0 p-4 gap-1 border-2 border-[#b3b3b3] rounded-[10px] bg-white flex flex-col">
              <p className="font-semibold mb-2">Accounts Receivable</p>
              <DataTable
                columns={columnsAR}
                data={dataTableAR}
                actions={{
                  view: true,
                  edit: false,
                  delete: false,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
