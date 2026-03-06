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
import type { AccountsReceivable } from "@typesm/accounts";

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
  const [salesByCategoryChart, setSalesByCategoryChart] = useState<
    PieChartItem[]
  >([]);
  const [topSellingProductsChart, setTopSellingProductsChart] = useState<
    BarChartItem[]
  >([]);
  const [accountsReceivableTable, setAccountsReceivableTable] = useState<
    AccountsReceivable[]
  >([]);

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

      if (reportsGeneralData?.salesByCategory) {
        const salesByCategoryChartData =
          reportsGeneralData.salesByCategory.result;
        setSalesByCategoryChart(addRandomFill(salesByCategoryChartData));
      }

      if (reportsGeneralData?.topSellingProducts) {
        const topSellingProductsData =
          reportsGeneralData.topSellingProducts.result;
        setTopSellingProductsChart(topSellingProductsData);
      }

      if (reportsGeneralData?.accountsReceivable) {
        const accountsReceivableData =
          reportsGeneralData.accountsReceivable.result;
        setAccountsReceivableTable(accountsReceivableData);
      }
    },
    [filters],
  );

  useEffect(() => {
    loadReportsGeneral();
  }, [filters, loadReportsGeneral]);

  const columnsar = columnsAR(t, i18n.language);

  const chartConfigSC = {
    items: {
      label: t("charts.chart_sales"),
    },
  };

  const chartConfigTSP = {
    sales: {
      label: t("charts.chart_sales"),
      color: "#1976D2",
    },
  };

  useImperativeHandle(childRef, () => ({
    createReport: async () => {
      const accounstReceivableData: AccountsReceivable[] =
        accountsReceivableTable;

      let totalCustomers = 0;
      if (customersStatus) {
        totalCustomers =
          Number(customersStatus.Active || 0) +
          Number(customersStatus["In Debt"] || 0);
      }

      let totalProducts = 0;
      if (productsStatus) {
        totalProducts =
          Number(productsStatus.Active || 0) +
          Number(productsStatus.Inactive || 0);
      }

      // Stats o Cards
      const statsData = [
        [t("exportReport.reports_general.title")],
        [t("exportReport.reports_general.investment"), investCard],
        [t("exportReport.reports_general.revenue"), revenueCard],
        [t("exportReport.reports_general.inventory_value"), inventoryValueCard],
        [t("exportReport.reports_general.sale_num"), salesAmountCard],
        [t("exportReport.reports_general.sale_amount"), salesNumberCard],
        [
          t("exportReport.reports_general.total_receivable"),
          salesPendingAmountCard,
        ],
        [],
        [t("exportReport.reports_general.customer_total_num"), totalCustomers],
        [
          t("exportReport.reports_general.customer_total_num"),
          customersStatus?.Active,
        ],
        [
          t("exportReport.reports_general.customer_in_debt"),
          customersStatus?.["In Debt"],
        ],
        [],
        [t("exportReport.reports_general.products_total_num"), totalProducts],
        [
          t("exportReport.reports_general.products_active"),
          productsStatus?.Active,
        ],
        [
          t("exportReport.reports_general.products_inactive"),
          productsStatus?.Inactive,
        ],
        [],
      ];

      // Table 1 -> Sales by Category Chart (SC)
      const tableHeadersSC = [t("columns.category"), t("columns.sale_num")];

      const rowsSC = salesByCategoryChart.map((x) => [x.category, x.sales]);

      // Table 2 -> Top Selling Porducts Chart (TSP)
      const tableHeadersTSP = [t("columns.product"), t("columns.sales_num")];

      const rowsTSP = topSellingProductsChart.map((x) => [x.product, x.sales]);

      // Table 3 -> Accounts Receivable Table (AR)
      const tableHeadersAR = [
        "ID",
        t("columns.customer"),
        t("columns.code_sku"),
        t("columns.debt_amount"),
        t("columns.debt_paid"),
        t("columns.debt_pending"),
        t("columns.created_at"),
      ];

      const rowsAR = accounstReceivableData.map((x) => [
        x.idCustomer,
        x.name + x.last_name,
        x.code_sku,
        x.debt_amount,
        x.debt_paid,
        x.debt_pending,
        x.created_at,
      ]);

      const finalData: dataExportReports[][] = [
        ...statsData,
        [t("exportReport.reports_general.sales_by_category")],
        tableHeadersSC,
        ...rowsSC,
        [],
        [t("exportReport.reports_general.top_selling_product")],
        tableHeadersTSP,
        ...rowsTSP,
        [],
        [t("exportReport.reports_general.accounts_receivable_table")],
        tableHeadersAR,
        ...rowsAR,
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
                chartData={salesByCategoryChart}
                chartConfig={chartConfigSC}
              />
            </div>
            <div className="max-w-[600px] min-w-[400px] w-[600px] h-full flex flex-col justify-center items-start p-5 gap-5 border-2 border-[#b3b3b3] rounded-[10px] bg-transparent">
              <p className="font-semibold mb-2 dark:text-white">
                {t("reports.chart2")}
              </p>
              <ChartBarLabel
                chartData={topSellingProductsChart}
                chartConfig={chartConfigTSP}
                xAxis="product"
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
            <DataTable columns={columnsar} data={accountsReceivableTable} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ReportsGeneral;
