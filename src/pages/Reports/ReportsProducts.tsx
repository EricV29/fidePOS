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
import type { Products } from "@typesm/products";
import CardInfoDetail from "@components/CardInfoDetail";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";

interface PieChartItem {
  fill: string;
  [key: string]: string | number;
}
interface BarChartItem {
  [key: string]: string | number;
}

//* Example data pie chart
const chartDataCPDB = [
  { category: "Maquillaje", products: 10 },
  { category: "Dulces", products: 20 },
  { category: "Edredones", products: 87 },
  { category: "Zapatos", products: 73 },
];

//* Example data bar chart
const chartDataTSPDB = [
  { product: "Edredon 2", sales: 86 },
  { product: "Bota azul", sales: 35 },
  { product: "Bolsa roja", sales: 37 },
  { product: "Mazapan", sales: 73 },
  { product: "Labial yuya", sales: 29 },
];

//* Example data table
const dataPBD = [
  {
    id: "123123",
    code_sku: "DASD45",
    product: "Carrito",
    description: "Hotweels",
    category: "toys",
    ccolor: "#ff49ff",
    cost_price: 100,
    unit_price: 120,
    stock: 2,
    status: "active",
    created_at: "01/01/2025",
  },
];

//* Example data status products
const dataStatusPDB = { Active: 40, Desactive: 15 };

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

interface ReportsProductsProps {}

const ReportsProducts: React.FC<ReportsProductsProps> = ({}) => {
  const [chartDataCP, setChartDataCP] = useState<PieChartItem[]>([]);
  const [chartDataTSP, setChartDataTSP] = useState<BarChartItem[]>([]);
  const [dataTableP, setDataTableP] = useState<Products[]>([]);
  const { t, i18n } = useTranslation();

  const { filters, childRef } = useOutletContext<ReportsContext>();
  //* GET DATA

  const loadReportsGeneral = useCallback(
    async (currentFilters = filters) => {
      //setLoading(true);
      console.log(currentFilters);

      // const response =
      //   await window.electronAPI.getReportsGeneralData(currenFilters);
      // const dashboardData =
      //   typeof response.result === "string"
      //     ? JSON.parse(response.result)
      //     : response.result;

      // if (dashboardData?.investment) {
      //   const investmentData = dashboardData.investment.result;
      //   setInvestCard(investmentData[0].investment);
      // }
    },
    [filters],
  );

  useEffect(() => {
    console.log(filters);

    loadReportsGeneral();
    setChartDataCP(addRandomFill(chartDataCPDB));
    setChartDataTSP(chartDataTSPDB);
    setDataTableP(dataPBD);
  }, [filters, loadReportsGeneral]);

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
            number={120238}
            format={true}
            color="#F57C00"
          />
          <CardInfoNumber
            icon={RevenueIcon}
            title={t("cards.revenue_title")}
            icond={null}
            number={10500}
            format={true}
            color="#43A047"
          />
          <CardInfoNumber
            icon={InvestmentIcon}
            title={t("cards.inventory_value_title")}
            icond={null}
            number={100000}
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
                chartData={chartDataCP}
                chartConfig={chartConfigCP}
              />
            </div>
            <div className="max-w-[600px] min-w-[400px] w-[600px] h-full flex flex-col justify-center items-start p-5 gap-5 border-2 border-[#b3b3b3] rounded-[10px] bg-transparent">
              <p className="font-semibold mb-2 dark:text-white">
                {t("reports.chart4")}
              </p>
              <ChartBarLabel
                chartData={chartDataTSP}
                chartConfig={chartConfigTSP}
                xAxis="product"
                yAxis="sales"
              />
            </div>
            <div className="flex flex-1 flex-col justify-between">
              <CardInfoDetail
                chartData={dataStatusPDB!}
                title={t("cards.products_status_title")}
                color="#1976D2"
              />
            </div>
          </div>
          <div className="w-full h-[500px] p-4 gap-1 border-2 border-[#b3b3b3] rounded-[10px] bg-transparent flex flex-col">
            <p className="font-semibold mb-2 dark:text-white">
              {t("reports.table3")}
            </p>
            <DataTable columns={columnsp} data={dataTableP} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ReportsProducts;
