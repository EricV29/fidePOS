import { useEffect, useState } from "react";
import DatePicker from "../components/DatePicker";
//import BarChartExample from "@/components/BarChart";
//import ChartPieDonutText from "@/components/PieChart";
import CardInfo from "../components/CardInfo";
import RevenueIcon from "../assets/icons/RevenueIcon";
import InvestmentIcon from "../assets/icons/InvestmentIcon";
import { DataTable } from "../components/ui/data-table";
import { columnsRSP } from "../components/ui/columnsRSP";
import { columnsAR } from "../components/ui/columnsAR";

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

export type AccountsReceivable = {
  id: string;
  date: string;
  totalAmount: number;
  paidAmount: number;
  debtPending: number;
  actions?: {
    view?: boolean;
    delete?: boolean;
    edit?: boolean;
  };
};

interface DashboardProps {}

const Dashboard: React.FC<DashboardProps> = ({}) => {
  const [installDate, setInstallDate] = useState(String);

  useEffect(() => {
    window.electronAPI.installDate().then((installDate) => {
      setInstallDate(installDate);
    });
  }, []);

  const dataTSC = [
    { category: "Edredones", sales: 14 },
    { category: "Maquillaje", sales: 39 },
    { category: "Jueguetes", sales: 26 },
    { category: "Dulces", sales: 53 },
    { category: "Peluches", sales: 42 },
  ];

  const dataTAPC = [
    { category: "Edredones", products: 100, fill: "#F57C00" },
    { category: "Maquillaje", products: 203, fill: "#FFA726" },
    { category: "Juguetes", products: 387, fill: "#4A4A4A" },
    { category: "Dulces", products: 73, fill: "#0277BD" },
  ];

  const chartConfigTAPC = {
    category: {
      label: "Category",
    },
  };

  //* Example data tables
  const dataAR: AccountsReceivable[] = [
    {
      id: "728ed51f",
      date: "16/11/2025",
      totalAmount: 25000,
      paidAmount: 5000,
      debtPending: 20000,
    },
    {
      id: "728ed51f",
      date: "16/11/2025",
      totalAmount: 25000,
      paidAmount: 5000,
      debtPending: 20000,
    },

    {
      id: "728ed51f",
      date: "16/11/2025",
      totalAmount: 25000,
      paidAmount: 5000,
      debtPending: 20000,
    },
    {
      id: "728ed51f",
      date: "16/11/2025",
      totalAmount: 25000,
      paidAmount: 5000,
      debtPending: 20000,
    },
    {
      id: "728ed51f",
      date: "16/11/2025",
      totalAmount: 25000,
      paidAmount: 5000,
      debtPending: 20000,
    },
  ];

  const dataRSP: RecentSalesPaid[] = [
    {
      id: "728ed51f",
      date: "16/11/2025",
      category: "Maquillaje",
      amount: 100,
    },
    {
      id: "728ed52f",
      date: "16/11/2025",
      category: "Dulces",
      amount: 100,
    },
    {
      id: "728ed53f",
      date: "16/11/2025",
      category: "Edredones",
      amount: 100,
    },
    {
      id: "728ed54f",
      date: "16/11/2025",
      category: "Edredones",
      amount: 100,
    },
    {
      id: "728ed55f",
      date: "16/11/2025",
      category: "Edredones",
      amount: 100,
    },
  ];

  if (!installDate) return null;

  return (
    <>
      <div className="w-full h-full flex flex-col min-h-0">
        <div className="w-full h-fit flex justify-between items-end">
          <h1 className="text-[30px] mb-0">Dashboard</h1>
          <DatePicker installDate={installDate} />
        </div>
        <hr className="border border-[#b3b3b3] my-2" />
        <div className="flex-1 min-h-0 w-full flex flex-col">
          <div className="h-fit p-2">
            <div className="h-[35vh] w-full flex justify-between gap-2 min-w-0">
              <div className="max-w-[600px] min-w-0 w-[600px] h-full flex flex-col justify-center items-start p-5 gap-5 border-2 border-[#b3b3b3] rounded-[10px] bg-white">
                <p className="font-semibold">Top 5 - Total Sales Categories</p>
                {/*
                <BarChartExample
                  chartData={dataTSC}
                  chartConfig={chartConfigTSC}
                  xKey={"category"}
                  yKey={"sales"}
                />
                */}
              </div>
              <div className="max-w-[300px] min-w-0 h-full flex flex-col justify-center items-center p-5 gap-5 border-2 border-[#b3b3b3] rounded-[10px] bg-white">
                <p className="font-semibold">
                  Total Active Products Categories
                </p>
                {/*
                <ChartPieDonutText
                  chartData={dataTAPC}
                  chartConfig={chartConfigTAPC}
                  xKey={"category"}
                  yKey={"products"}
                />
                */}
              </div>
              <div className="max-w-[300px] min-w-0 w-[300px] h-full flex flex-col gap-2 justify-between items-center">
                <CardInfo
                  icon={RevenueIcon}
                  title="Revenue"
                  icond={null}
                  number={1000}
                  color="#43A047"
                />
                <CardInfo
                  icon={InvestmentIcon}
                  title="Investment"
                  icond={null}
                  number={120238}
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
                data={dataRSP}
                actions={{
                  view: true,
                  edit: false,
                  delete: false,
                }}
              />
              {/*
              <TableDemo
                dataTable={dataRSPF}
                activeTotal={false}
                actions={{ view: true }}
              />
              */}
            </div>
            <div className="w-1/2 h-full min-h-0 p-4 gap-1 border-2 border-[#b3b3b3] rounded-[10px] bg-white flex flex-col">
              <p className="font-semibold mb-2">Accounts Receivable</p>
              <DataTable
                columns={columnsAR}
                data={dataAR}
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
};

export default Dashboard;
