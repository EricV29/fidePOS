import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import CardInfoNumber from "@components/CardInfoNumber";
import BoxIcon from "@icons/BoxIcon";
import ShoppingCar from "@icons/ShoppingCar";
import ChartPieDonutText from "@components/chart-pie-donut";
import { addRandomFill } from "@utility/AddFill";
import ChartBarLabel from "@components/char-bar-label";
import { DataTable } from "@components/data-table";
import { columnsS } from "@columns/columnsS";
import type { Sales } from "@typesm/sales";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";

interface PieChartItem {
  fill: string;
  [key: string]: string | number;
}
interface BarChartItem {
  [key: string]: string | number;
}

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

interface ReportsSalesProps {}

const ReportsSales: React.FC<ReportsSalesProps> = ({}) => {
  const { t, i18n } = useTranslation();
  const { filters, childRef } = useOutletContext<ReportsContext>();

  //* GET DATA
  const [inventoryValueCard, setInventoryValueCard] = useState(Number);
  const [salesNumberCard, setSalesNumberCard] = useState(Number);
  const [salesAmountCard, setSalesAmountCard] = useState(Number);
  const [salesByCategoryChart, setSalesByCategoryChart] = useState<
    PieChartItem[]
  >([]);
  const [topSellingProductsChart, setTopSellingProductsChart] = useState<
    BarChartItem[]
  >([]);
  const [allHistorySales, setAllHistorySales] = useState<Sales[]>([]);

  const loadReportsGeneral = useCallback(
    async (currentFilters = filters) => {
      //setLoading(true);
      const response =
        await window.electronAPI.getReportsSalesData(currentFilters);
      const reportsSalesData =
        typeof response.result === "string"
          ? JSON.parse(response.result)
          : response.result;

      if (reportsSalesData?.inventoryValue) {
        const inventoryValueData = reportsSalesData.inventoryValue.result;
        setInventoryValueCard(inventoryValueData[0].inventory_value);
      }

      if (reportsSalesData?.salesNumberAmount) {
        const salesNumberAmountData = reportsSalesData.salesNumberAmount.result;
        setSalesNumberCard(salesNumberAmountData.dataNumber[0].salesNumber);
        setSalesAmountCard(salesNumberAmountData.dataAmount[0].salesAmount);
      }

      if (reportsSalesData?.salesByCategory) {
        const salesByCategoryChartData =
          reportsSalesData.salesByCategory.result;
        setSalesByCategoryChart(addRandomFill(salesByCategoryChartData));
      }

      if (reportsSalesData?.topSellingProducts) {
        const topSellingProductsData =
          reportsSalesData.topSellingProducts.result;
        setTopSellingProductsChart(topSellingProductsData);
      }

      if (reportsSalesData?.allHistorySales) {
        const historySalesData = reportsSalesData.allHistorySales.result;
        setAllHistorySales(historySalesData);
      }
    },
    [filters],
  );

  useEffect(() => {
    loadReportsGeneral();
  }, [filters, loadReportsGeneral]);

  const columnss = columnsS(t, i18n.language);

  const chartConfigCS = {
    items: {
      label: t("charts.chart_sales"),
    },
  };

  const chartConfigTCS = {
    sales: {
      label: t("charts.chart_sales"),
      color: "#1976D2",
    },
  };

  useImperativeHandle(childRef, () => ({
    createReport: async () => {
      const salesData: Sales[] = allHistorySales;

      // Stats o Cards
      const statsData = [
        [t("exportReport.reports_sales.title")],
        [t("exportReport.reports_sales.inventory_value"), inventoryValueCard],
        [t("exportReport.reports_sales.sales_num"), salesNumberCard],
        [t("exportReport.reports_sales.sales_amount"), salesAmountCard],
      ];

      // Table 1 -> Sales by Category Chart (SC)
      const tableHeadersSC = [t("columns.category"), t("columns.sale_num")];

      const rowsSC = salesByCategoryChart.map((x) => [x.category, x.sales]);

      // Table 2 -> Top Selling Porducts Chart (TSP)
      const tableHeadersTSP = [t("columns.product"), t("columns.sale_num")];

      const rowsTSP = topSellingProductsChart.map((x) => [x.product, x.sales]);

      // Table 3 -> Sales
      const tableHeaders = [
        "ID",
        t("columns.sale_num"),
        t("columns.name"),
        t("columns.last_name"),
        t("columns.products"),
        t("columns.total_amount"),
        t("columns.paid_amount"),
        t("columns.pending_amount"),
        t("columns.discount"),
        t("columns.status"),
        t("columns.user_id"),
        t("columns.created_at"),
      ];

      const rows = salesData.map((x) => [
        x.id,
        x.sale_num,
        x.name,
        x.last_name,
        x.products,
        x.total_amount,
        x.paid_amount,
        x.pending_amount,
        x.discount,
        x.status,
        x.user_id,
        x.created_at,
      ]);

      const finalData: dataExportReports[][] = [
        ...statsData,
        [],
        [t("exportReport.reports_sales.sales_by_category")],
        tableHeadersSC,
        ...rowsSC,
        [],
        [t("exportReport.reports_sales.top_selling_product")],
        tableHeadersTSP,
        ...rowsTSP,
        [],
        [t("exportReport.reports_sales.detail_sales")],
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
            icon={BoxIcon}
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
        </div>
        <div className="w-full h-auto flex-1 flex flex-col overflow-y-auto gap-2">
          <div className="w-full flex gap-2 h-[280px]">
            <div className="max-w-[300px] min-w-0 w-full h-full flex flex-col justify-center items-center p-5 gap-5 border-2 border-[#b3b3b3] rounded-[10px] bg-transparent">
              <p className="font-semibold dark:text-white">
                {t("reports.chart1")}
              </p>
              <ChartPieDonutText
                chartData={salesByCategoryChart}
                chartConfig={chartConfigCS}
              />
            </div>
            <div className="max-w-[600px] min-w-[400px] w-[600px] h-full flex flex-col justify-center items-start p-5 gap-5 border-2 border-[#b3b3b3] rounded-[10px] bg-transparent">
              <p className="font-semibold mb-2 dark:text-white">
                {t("reports.chart2")}
              </p>
              <ChartBarLabel
                chartData={topSellingProductsChart}
                chartConfig={chartConfigTCS}
                xAxis="product"
                yAxis="sales"
              />
            </div>
          </div>
          <div className="w-full h-[500px] p-4 gap-1 border-2 border-[#b3b3b3] rounded-[10px] bg-transparent flex flex-col">
            <p className="font-semibold mb-2 dark:text-white">
              {t("reports.table2")}
            </p>
            <DataTable columns={columnss} data={allHistorySales} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ReportsSales;
