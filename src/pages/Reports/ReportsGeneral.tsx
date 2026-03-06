import React, {
  useCallback,
  useEffect,
  useState,
  useImperativeHandle,
} from "react";
import CardInfoNumber from "@components/CardInfoNumber";
import CardInfoDetail from "@components/CardInfoDetail";
import InvestmentIcon from "@icons/InvestmentIcon";
import ShoppingCar from "@icons/ShoppingCar";
import RevenueIcon from "@icons/RevenueIcon";
import ChartPieDonutText from "@components/chart-pie-donut";
import { addRandomFill } from "@utility/AddFill";
import ChartBarLabel from "@components/char-bar-label";
import { DataTable } from "@components/data-table";
import { columnsAR } from "@columns/columnsAR";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
import { useLoading } from "@context/LoadingContext";

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

export type dataExportReports = string | number | boolean | null | undefined;

// hijo > padre
interface ExportableChild {
  createReport: (view: string) => Promise<dataExportReports[][]>;
}

// Padre > hijo
interface ReportsContext {
  childRef: React.RefObject<ExportableChild>;
  filters: {
    startDate: string;
    endDate: string;
  };
}

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

interface dataCustomersI {
  [key: string]: number;
}

const ReportsGeneral: React.FC<ReportsGeneralProps> = ({}) => {
  const [chartDataCSF, setChartDataCSF] = useState<PieChartItem[]>([]);
  const [chartDataTCS, setChartDataTSC] = useState<BarChartItem[]>([]);
  const [dataTableAR, setDataTableAR] = useState<AccountsReceivable[]>([]);
  const { t, i18n } = useTranslation();
  const { setLoading } = useLoading();
  const { filters, childRef } = useOutletContext<ReportsContext>();

  //* GET DATA
  const [investCard, setInvestCard] = useState(Number);
  const [revenueCard, setRevenueCard] = useState(Number);
  const [inventoryValueCard, setInventoryValueCard] = useState(Number);
  const [salesNumberCard, setSalesNumberCard] = useState(Number);
  const [salesAmountCard, setSalesAmountCard] = useState(Number);
  const [salesPendingAmountCard, setSalesPendingAmountCard] = useState(Number);
  const [customersStatus, setCustomersStatus] = useState<dataCustomersI>();
  const [productsStatus, setProductsStatus] = useState<dataCustomersI>();

  const loadReportsGeneral = useCallback(
    async (currentFilters = filters) => {
      // setLoading(true);
      const response =
        await window.electronAPI.getReportsGeneralData(currentFilters);
      const reportsGeneralData =
        typeof response.result === "string"
          ? JSON.parse(response.result)
          : response.result;

      if (reportsGeneralData?.investment) {
        const investmentData = reportsGeneralData.investment.result;
        setInvestCard(investmentData[0].investment);
      }

      if (reportsGeneralData?.revenue) {
        const revenueData = reportsGeneralData.revenue.result;
        setRevenueCard(revenueData[0].revenue);
      }

      if (reportsGeneralData?.inventoryValue) {
        const inventoryValueData = reportsGeneralData.inventoryValue.result;
        setInventoryValueCard(inventoryValueData[0].inventory_value);
      }

      if (reportsGeneralData?.salesNumberAmount) {
        const salesNumberAmountData =
          reportsGeneralData.salesNumberAmount.result;
        setSalesNumberCard(salesNumberAmountData.dataNumber[0].salesNumber);
        setSalesAmountCard(salesNumberAmountData.dataAmount[0].salesAmount);
      }

      if (reportsGeneralData?.salesPendingAmount) {
        const salesPendingAmountData =
          reportsGeneralData.salesPendingAmount.result;
        setSalesPendingAmountCard(salesPendingAmountData[0].pendingSalesAmount);
      }

      if (reportsGeneralData?.customersStatus) {
        const customersStatusData = reportsGeneralData.customersStatus.result;
        setCustomersStatus(customersStatusData[0]);
      }

      if (reportsGeneralData?.productsStatus) {
        const productsStatusData = reportsGeneralData.productsStatus.result;
        setProductsStatus(productsStatusData[0]);
      }
    },
    [filters],
  );

  useEffect(() => {
    loadReportsGeneral();
    setChartDataCSF(addRandomFill(chartDataCSDB));
    setChartDataTSC(chartDataTCSDB);
    setDataTableAR(dataARBD);
  }, [filters, loadReportsGeneral]);

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

  useImperativeHandle(childRef, () => ({
    createReport: async (view: string) => {
      let generalData: Customers[] = customerTable;

      if (view === "total") {
        try {
          setLoading(true);
          const response = await window.electronAPI.getAllCustomers();
          if (response.success) {
            const rawData =
              typeof response.result === "string"
                ? JSON.parse(response.result)
                : response.result;

            generalData = rawData as Customers[];
          }
        } catch (err) {
          console.error("Comunication Error:", err);
        } finally {
          setLoading(false);
        }
      }

      const statsData = [
        [t("exportReport.customer_general.title")],
        [
          t("exportReport.customer_general.customers_number"),
          customersNumberCard,
        ],
        [
          t("exportReport.customer_general.customers_debts_number"),
          customersInDebtNumberCard,
        ],
        [
          t("exportReport.customer_general.total_debt_amount"),
          totalDebtAmountCard,
        ],
        [
          t("exportReport.customer_general.last_customer_name_paid"),
          lastCustomerNamePaidCard,
        ],
        [
          t("exportReport.customer_general.last_customer_name_paid_date"),
          lastCustomerNamePaidCardDate,
        ],
        [],
      ];

      const tableHeaders = [
        "ID",
        t("columns.name"),
        t("columns.last_name"),
        t("columns.phone"),
        t("columns.status"),
        t("columns.debts_number"),
        t("columns.debt_amount"),
        t("columns.debt_paid"),
        t("columns.created_at"),
      ];

      const rows = generalData.map((cg) => [
        cg.id,
        cg.name,
        cg.last_name,
        cg.phone,
        cg.status,
        cg.debts_number,
        cg.debts_amount,
        cg.debts_paid,
        cg.created_at,
      ]);

      const finalData: dataExportReports[][] = [
        [t("exportReport.customer_general.detail_customers")],
        ...statsData,
        tableHeaders,
        ...rows,
      ];

      return finalData;
    },
  }));

  return (
    <>
      <div className="w-full h-full flex flex-col gap-2">
        <div className="flex gap-2 h-[110px] overflow-x-auto overflow-y-hidden">
          <CardInfoNumber
            icon={InvestmentIcon}
            title={t("cards.investment_title")}
            icond={null}
            number={investCard}
            format={true}
            color="#F57C00"
          />
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
            title={t("cards.inventory_value_title")}
            icond={null}
            number={inventoryValueCard}
            format={true}
            color="#FFC107"
          />
          <CardInfoNumber
            icon={ShoppingCar}
            title={t("cards.sales_title") + `: ${salesNumberCard}`}
            icond={null}
            number={salesAmountCard}
            format={true}
            color="#1976D2"
          />
          <CardInfoNumber
            icon={InvestmentIcon}
            title={t("cards.pending_title")}
            icond={null}
            number={salesPendingAmountCard}
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
                chartData={customersStatus!}
                title={t("cards.customers_title")}
                color="#1976D2"
              />

              <CardInfoDetail
                chartData={productsStatus!}
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
