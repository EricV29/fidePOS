import { useEffect, useState } from "react";
import DatePicker from "../components/DatePicker";
import BarChartExample from "@/components/BarChart";
import ChartPieDonutText from "@/components/PieChart";
import TableDemo from "@/components/Table";
import CardInfo from "../components/CardInfo";
import RevenueIcon from "@/assets/icons/RevenueIcon";
import InvestmentIcon from "@/assets/icons/InvestmentIcon";
import {
  Table,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DashboardProps {}

const Dashboard: React.FC<DashboardProps> = ({}) => {
  const [installDate, setInstallDate] = useState<string | null>(null);

  useEffect(() => {
    window.electronAPI.installDate().then((installDate) => {
      setInstallDate(installDate);
    });
  }, []);

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
                <BarChartExample />
              </div>
              <div className="max-w-[300px] min-w-0 h-full flex flex-col justify-center items-center p-5 gap-5 border-2 border-[#b3b3b3] rounded-[10px] bg-white">
                <p className="font-semibold">
                  Total Active Products Categories
                </p>
                <ChartPieDonutText />
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
              <p className="font-semibold mb-2">Accounts Receivable</p>
              <Table>
                <TableHeader className="bg-[#FFEFDE]">
                  <TableRow>
                    <TableHead className="text-[#000] text-center font-semibold">
                      No.
                    </TableHead>
                    <TableHead className="text-[#000] text-center font-semibold">
                      Date
                    </TableHead>
                    <TableHead className="text-[#000] text-center font-semibold">
                      Total
                    </TableHead>
                    <TableHead className="text-[#000] text-center font-semibold">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
              </Table>

              <div className="flex-1 min-h-0 overflow-y-auto">
                <TableDemo />
              </div>

              <Table>
                <TableFooter>
                  <TableRow className="bg-[#b3b3b340]">
                    <TableCell colSpan={2} className="font-bold">
                      TOTAL:
                    </TableCell>
                    <TableCell className="text-right font-bold text-[#43A047]">
                      $2,500.00
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
            <div className="w-1/2 h-full min-h-0 p-4 gap-1 border-2 border-[#b3b3b3] rounded-[10px] bg-white flex flex-col">
              <p className="font-semibold mb-2">Accounts Receivable</p>
              <Table>
                <TableHeader className="bg-[#FFEFDE]">
                  <TableRow>
                    <TableHead className="text-[#000] text-center font-semibold">
                      No.
                    </TableHead>
                    <TableHead className="text-[#000] text-center font-semibold">
                      Date
                    </TableHead>
                    <TableHead className="text-[#000] text-center font-semibold">
                      Total
                    </TableHead>
                    <TableHead className="text-[#000] text-center font-semibold">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
              </Table>

              <div className="flex-1 min-h-0 overflow-y-auto">
                <TableDemo />
              </div>

              <Table>
                <TableFooter>
                  <TableRow className="bg-[#b3b3b340]">
                    <TableCell colSpan={2} className="font-bold">
                      TOTAL:
                    </TableCell>
                    <TableCell className="text-right font-bold text-[#43A047]">
                      $2,500.00
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
