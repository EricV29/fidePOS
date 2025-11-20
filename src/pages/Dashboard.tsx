import { useEffect, useState } from "react";
import DatePicker from "../components/DatePicker";
import BarChartExample from "@/components/BarChart";
import ChartPieDonutText from "@/components/PieChart";
import TableDemo from "@/components/Table";
import CardInfo from "../components/CardInfo";
import RevenueIcon from "@/assets/icons/RevenueIcon";
import InvestmentIcon from "@/assets/icons/InvestmentIcon";
import { parseNumberData } from "../utility/numberParser";

interface DashboardProps {}

const Dashboard: React.FC<DashboardProps> = ({}) => {
  const [installDate, setInstallDate] = useState(String);
  const [dataARF, setDataARF] = useState<Record<string, any>[]>([]);
  const [dataRSPF, setDataRSPF] = useState<Record<string, any>[]>([]);

  useEffect(() => {
    window.electronAPI.installDate().then((installDate) => {
      setInstallDate(installDate);
    });

    loadData();
  }, []);

  const dataTSC = [
    { category: "Edredones", sales: 14 },
    { category: "Maquillaje", sales: 39 },
    { category: "Jueguetes", sales: 26 },
    { category: "Dulces", sales: 53 },
    { category: "Peluches", sales: 42 },
  ];

  const chartConfigTSC = {
    sales: {
      color: "#F57C00",
    },
  };

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

  const dataRSP = [
    {
      date: "16/11/2025",
      totalAmount: 25000,
    },
    {
      date: "16/11/2025",
      totalAmount: 15000,
    },
    {
      date: "16/11/2025",
      totalAmount: 35000,
    },
    {
      date: "16/11/2025",
      totalAmount: 45000,
    },
  ];

  const dataAR = [
    {
      date: "16/11/2025",
      totalAmount: 25000,
      paidAmount: 5000,
      debtPaid: 20000,
    },
    {
      date: "16/11/2025",
      totalAmount: 15000,
      paidAmount: 5000,
      debtPaid: 10000,
    },
  ];

  async function loadData() {
    setDataRSPF(parseNumberData(dataRSP));
    setDataARF(parseNumberData(dataAR));
  }
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
                <BarChartExample
                  chartData={dataTSC}
                  chartConfig={chartConfigTSC}
                  xKey={"category"}
                  yKey={"sales"}
                />
              </div>
              <div className="max-w-[300px] min-w-0 h-full flex flex-col justify-center items-center p-5 gap-5 border-2 border-[#b3b3b3] rounded-[10px] bg-white">
                <p className="font-semibold">
                  Total Active Products Categories
                </p>
                <ChartPieDonutText
                  chartData={dataTAPC}
                  chartConfig={chartConfigTAPC}
                  xKey={"category"}
                  yKey={"products"}
                />
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
              <TableDemo
                dataTable={dataRSPF}
                activeTotal={false}
                actions={{ view: true }}
              />
            </div>
            <div className="w-1/2 h-full min-h-0 p-4 gap-1 border-2 border-[#b3b3b3] rounded-[10px] bg-white flex flex-col">
              <p className="font-semibold mb-2">Accounts Receivable</p>
              <TableDemo
                dataTable={dataARF}
                activeTotal={true}
                actions={{ view: true }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
