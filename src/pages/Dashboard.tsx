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
import { useTranslation } from "react-i18next";
import { ModalSales } from "@modals/ModalSales";
import { useModal } from "@context/ModalContext";
import { ModalNewPayment } from "@modals/ModalNewPayment";
import { useOutletContext } from "react-router-dom";
import { useLoading } from "@/context/LoadingContext";

interface BarChartItem {
  [key: string]: string | number;
}

interface PieChartItem {
  fill: string;
  [key: string]: string | number;
}

//* Example data bar chart ✅
const chartDataTCSDB = [
  { category: "Maquillaje", sales: 186 },
  { category: "Regalos", sales: 305 },
  { category: "Edredones", sales: 237 },
  { category: "Dulces", sales: 73 },
  { category: "Zapatos", sales: 209 },
];

//* Example data pie chart ✅
const chartDataTAPCDB = [
  { category: "Maquillaje", products: 200 },
  { category: "Dulces", products: 200 },
  { category: "Edredones", products: 287 },
  { category: "Zapatos", products: 173 },
];

//* Example data cards
const dataRevenueBD = 100000;
const dataInvestBD = 12238;

//* Example data tables
const dataRSPBD = [
  {
    id: "728ed51f",
    num_sale: "0001",
    created_at: "2025-11-16 00:00:00",
    category: "Maquillaje",
    ccolor: "#5b49ff",
    status: "paid",
    total_amount: 100,
  },
  {
    id: "728ed52f",
    num_sale: "0002",
    created_at: "2025-11-16 00:00:00",
    category: "toys",
    ccolor: "#ff49ff",
    status: "unpaid",
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
    created_at: "2025-02-15 00:00:00",
  },
];

interface MyContext {
  installDate: string;
}

export default function Dashboard() {
  const { installDate } = useOutletContext<MyContext>();
  const { t, i18n } = useTranslation();
  const [chartDataTCS, setChartDataTSC] = useState<BarChartItem[]>([]);
  const [chartDataTAPCF, setChartDataTAPCF] = useState<PieChartItem[]>([]);
  const [revenueCard, setRevenueCard] = useState(Number);
  const [investCard, setInvestCard] = useState(Number);
  const [dataTableRSP, setDataTableRSP] = useState<RecentSalesPaid[]>([]);
  const [dataTableAR, setDataTableAR] = useState<AccountsReceivable[]>([]);
  const { setModal } = useModal();
  const { setLoading } = useLoading();
  const today = new Date().toISOString().split("T")[0];
  const [filters, setFilters] = useState({
    startDate: installDate
      ? new Date(installDate).toISOString().split("T")[0]
      : today,
    endDate: today,
  });

  const loadDashboard = async (currentFilters = filters) => {
    setLoading(true);
    const response = await window.electronAPI.getDashboardData(currentFilters);
    const dashboardData =
      typeof response.result === "string"
        ? JSON.parse(response.result)
        : response.result;

    if (dashboardData?.topSalesCategory) {
      const chartData = dashboardData.topSalesCategory.result;
      setChartDataTSC(chartData);
    }

    if (dashboardData?.activeProductsCategory) {
      const chartPieData = dashboardData.activeProductsCategory.result;
      setChartDataTAPCF(addRandomFill(chartPieData));
    }

    if (dashboardData?.investment) {
      const investmentData = dashboardData.investment.result;
      setInvestCard(investmentData[0].investment);
    }

    if (dashboardData?.revenue) {
      const investmentData = dashboardData.revenue.result;
      setRevenueCard(investmentData[0].revenue);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
    setDataTableRSP(dataRSPBD);
    setDataTableAR(dataARBD);
  }, []);

  const columnsrsp = columnsRSP(t, i18n.language);
  const columnsar = columnsAR(t, i18n.language);

  const chartConfigTCS = {
    sales: {
      label: t("charts.chart_tcs"),
      color: "#F57C00",
    },
  };

  const chartConfigTAPC = {
    items: {
      label: t("charts.chart_apc"),
    },
  };

  const handleDateChange = (
    startDate: string | null,
    endDate: string | null,
  ) => {
    const newFilters = {
      startDate: startDate || "",
      endDate: endDate || "",
    };
    setFilters(newFilters);
    loadDashboard(newFilters);
  };

  if (!installDate) return null;

  return (
    <>
      <div className="w-full h-full flex flex-col min-h-0">
        <div className="w-full h-fit flex justify-between items-end">
          <h1 className="text-[30px]">{t("dashboard.title")}</h1>
          <DatePicker installDate={installDate} onApply={handleDateChange} />
        </div>
        <hr className="border border-[#b3b3b3] my-2" />
        <div className="flex-1 min-h-0 w-full flex flex-col">
          <div className="h-fit p-2">
            <div className="h-[35vh] w-full flex justify-between gap-2 min-w-0">
              <div className="max-w-[600px] min-w-0 w-[600px] h-full flex flex-col justify-center items-start p-5 gap-5 border-2 border-[#b3b3b3] rounded-[10px] bg-white dark:bg-[#353935] ">
                <p className="font-semibold mb-2 dark:text-white">
                  {t("dashboard.chart1")}
                </p>
                <ChartBarLabel
                  chartData={chartDataTCS}
                  chartConfig={chartConfigTCS}
                  xAxis="category"
                  yAxis="sales"
                />
              </div>
              <div className="max-w-[300px] min-w-0 h-full flex flex-col justify-center items-center p-5 gap-5 border-2 border-[#b3b3b3] rounded-[10px] bg-white dark:bg-[#353935]">
                <p className="font-semibold dark:text-white">
                  {t("dashboard.chart2")}
                </p>
                <ChartPieDonutText
                  chartData={chartDataTAPCF}
                  chartConfig={chartConfigTAPC}
                />
              </div>
              <div className="max-w-[300px] min-w-0 w-[300px] h-full flex flex-col gap-2 justify-between items-center">
                <CardInfoNumber
                  icon={RevenueIcon}
                  title={t("cards.revenue_title")}
                  icond={null}
                  number={revenueCard}
                  format={true}
                  color="#43A047"
                />
                <CardInfoNumber
                  icon={InvestmentIcon}
                  title={t("cards.investment_title")}
                  icond={null}
                  number={investCard}
                  format={true}
                  color="#F57C00"
                />
              </div>
            </div>
          </div>
          <div className="flex-1 min-h-0 p-2 flex gap-2">
            <div className="w-1/2 h-full min-h-0 p-4 gap-1 border-2 border-[#b3b3b3] rounded-[10px] bg-white dark:bg-[#353935] flex flex-col">
              <p className="font-semibold mb-2 dark:text-white">
                {t("dashboard.table1")}
              </p>
              <DataTable
                columns={columnsrsp}
                data={dataTableRSP}
                actions={{
                  onView: (row) => {
                    setModal(
                      <ModalSales
                        sale={{
                          id: row.id,
                          num_sale: row.num_sale,
                          status: row.status,
                          total_amount: row.total_amount,
                          created_at: row.created_at,
                        }}
                      />,
                    );
                  },
                }}
              />
            </div>
            <div className="w-1/2 h-full min-h-0 p-4 gap-1 border-2 border-[#b3b3b3] rounded-[10px] bg-white dark:bg-[#353935] flex flex-col">
              <p className="font-semibold mb-2 dark:text-white">
                {t("dashboard.table2")}
              </p>
              <DataTable
                columns={columnsar}
                data={dataTableAR}
                actions={{
                  onView: (row) => {
                    const data = {
                      idCustomer: row.id,
                      idSaleDetail: row.id,
                    };

                    setModal(<ModalNewPayment account={data} />);
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
