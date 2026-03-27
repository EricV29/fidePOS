import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import CardInfoNumber from "@components/CardInfoNumber";
import InvestmentIcon from "@icons/InvestmentIcon";
import RevenueIcon from "@icons/RevenueIcon";
import ChartPieDonutText from "@components/chart-pie-donut";
import { addRandomFill } from "@utility/AddFill";
import ChartBarLabel from "@components/char-bar-label";
import { DataTable } from "@components/data-table";
import { columnsP } from "@columns/columnsP";
import CardInfoDetail from "@components/CardInfoDetail";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
import type { Products } from "@typesm/products";
import type {
  PieChartValue,
  BarChartValue,
  ExportReportValue,
  CardInfoValue,
} from "@typesm/global";

// hijo > padre
interface ExportableChild {
  createReport: (view: string) => Promise<ExportReportValue[][]>;
}

// Padre > hijo
interface ReportsContext {
  childRef: React.RefObject<ExportableChild>;
  filters: {
    startDate: string;
    endDate: string;
  };
}

const ReportsProducts = () => {
  const { t, i18n } = useTranslation();
  const { filters, childRef } = useOutletContext<ReportsContext>();

  const columnsp = columnsP(t, i18n.language);
  const chartConfigCP = {
    items: {
      label: "Products",
    },
  };

  const chartConfigTSP = {
    sales: {
      label: "Sales",
      color: "#1976D2",
    },
  };

  //* GET DATA
  const [investmentCard, setInvestmentCard] = useState(Number);
  const [revenueCard, setRevenueCard] = useState(Number);
  const [inventoryValueCard, setInventoryValueCard] = useState(Number);
  const [productsByCategoryChart, setProductsByCategoryChart] = useState<
    PieChartValue[]
  >([]);
  const [topSellingProductsChart, setTopSellingProductsChart] = useState<
    BarChartValue[]
  >([]);
  const [productsStatus, setProductsStatus] = useState<CardInfoValue>();
  const [productsTable, setProductsTable] = useState<Products[]>([]);

  const loadReportsGeneral = useCallback(
    async (currentFilters = filters) => {
      // setLoading(true);
      const response =
        await window.electronAPI.getReportsProductsData(currentFilters);
      const reportsProductsData =
        typeof response.result === "string"
          ? JSON.parse(response.result)
          : response.result;

      if (reportsProductsData?.investment) {
        const investmentData = reportsProductsData.investment.result;
        setInvestmentCard(investmentData[0].investment);
      }

      if (reportsProductsData?.revenue) {
        const revenueData = reportsProductsData.revenue.result;
        setRevenueCard(revenueData[0].revenue);
      }

      if (reportsProductsData?.inventoryValue) {
        const inventoryValueData = reportsProductsData.inventoryValue.result;
        setInventoryValueCard(inventoryValueData[0].inventory_value);
      }

      if (reportsProductsData?.productsByCategory) {
        const productsByCategoryChartData =
          reportsProductsData.productsByCategory.result;

        setProductsByCategoryChart(addRandomFill(productsByCategoryChartData));
      }

      if (reportsProductsData?.topSellingProducts) {
        const topSellingProductsData =
          reportsProductsData.topSellingProducts.result;
        setTopSellingProductsChart(topSellingProductsData);
      }

      if (reportsProductsData?.productsStatus) {
        const productsStatusData = reportsProductsData.productsStatus.result;
        setProductsStatus(productsStatusData[0]);
      }

      if (reportsProductsData?.products) {
        const productsData = reportsProductsData.products.result;
        setProductsTable(productsData);
      }
    },
    [filters],
  );

  useEffect(() => {
    loadReportsGeneral();
  }, [filters, loadReportsGeneral]);

  useImperativeHandle(childRef, () => ({
    createReport: async () => {
      const productsData: Products[] = productsTable;

      let totalProducts = 0;
      if (productsStatus) {
        totalProducts =
          Number(productsStatus.Active || 0) +
          Number(productsStatus.Inactive || 0);
      }

      const statsData = [
        [t("exportReport.reports_products.title")],
        [t("exportReport.reports_products.investment"), investmentCard],
        [t("exportReport.reports_products.revenue"), revenueCard],
        [
          t("exportReport.reports_products.inventory_value"),
          inventoryValueCard,
        ],
        [t("exportReport.reports_products.products_total_num"), totalProducts],
        [
          t("exportReport.reports_products.products_active"),
          productsStatus?.Active,
        ],
        [
          t("exportReport.reports_products.products_inactive"),
          productsStatus?.Inactive,
        ],
        [],
      ];

      // Table 1 -> Products by Category Chart (PC)
      const tableHeadersPC = [t("columns.category"), t("columns.sale_num")];
      const rowsPC = productsByCategoryChart.map((x) => [
        x.category,
        x.products,
      ]);

      // Table 2 -> Top Selling Products Chart (TSP)
      const tableHeadersTSP = [t("columns.products"), t("columns.sale_num")];
      const rowsTSP = topSellingProductsChart.map((x) => [x.products, x.sales]);

      // Table 3 -> Products Table
      const tableHeadersP = [
        "ID",
        t("columns.code_sku"),
        t("columns.product"),
        t("columns.description"),
        t("columns.category"),
        "Color",
        t("columns.cost_price"),
        t("columns.unit_price"),
        "Stock",
        t("columns.status"),
        t("columns.created_at"),
        t("columns.deleted_at"),
      ];

      const rowsP = productsData.map((x) => [
        x.id,
        x.code_sku,
        x.product,
        x.description,
        x.category,
        x.ccolor,
        x.cost_price,
        x.unit_price,
        x.stock,
        x.status,
        x.created_at,
        x.deleted_at,
      ]);

      const finalData: ExportReportValue[][] = [
        ...statsData,
        [],
        [t("exportReport.reports_products.products_by_category")],
        tableHeadersPC,
        ...rowsPC,
        [],
        [t("exportReport.reports_products.top_selling_product")],
        tableHeadersTSP,
        ...rowsTSP,
        [],
        [t("exportReport.reports_products.detail_sales")],
        tableHeadersP,
        ...rowsP,
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
            number={investmentCard}
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
        </div>
        <div className="w-full h-auto flex-1 flex flex-col overflow-y-auto gap-2">
          <div className="w-full flex gap-2 h-[280px]">
            <div className="max-w-[300px] min-w-0 w-full h-full flex flex-col justify-center items-center p-5 gap-5 border-2 border-[#b3b3b3] rounded-[10px] bg-transparent">
              <p className="font-semibold dark:text-white">
                {t("reports.chart3")}
              </p>
              <ChartPieDonutText
                chartData={productsByCategoryChart}
                chartConfig={chartConfigCP}
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
                chartData={productsStatus!}
                title={t("cards.products_status_title")}
                color="#1976D2"
              />
            </div>
          </div>
          <div className="w-full h-[500px] p-4 gap-1 border-2 border-[#b3b3b3] rounded-[10px] bg-transparent flex flex-col">
            <p className="font-semibold mb-2 dark:text-white">
              {t("reports.table3")}
            </p>
            <DataTable columns={columnsp} data={productsTable} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ReportsProducts;
