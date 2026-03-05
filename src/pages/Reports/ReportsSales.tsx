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

//* Example data table
const dataSBD = [
  {
    id: "34234",
    name: "Eric",
    last_name: "Villeda",
    num_sale: "0001",
    products:
      "Labial, carrito, estuche, peluche, edredon, manguito, peine, cepillo, bolsa, moño",
    total_amount: 1000,
    paid_amount: 1000,
    pending_amount: 0,
    status: "paid",
    created_at: "2025-11-16 00:00:00",
  },
];

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
  const [chartDataCSF, setChartDataCSF] = useState<PieChartItem[]>([]);
  const [chartDataTCS, setChartDataTSC] = useState<BarChartItem[]>([]);
  const [dataTableS, setDataTableS] = useState<Sales[]>([]);
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
    setChartDataCSF(addRandomFill(chartDataCSDB));
    setChartDataTSC(chartDataTCSDB);
    setDataTableS(dataSBD);
  }, [filters]);

  const columnss = columnsS(t, i18n.language);

  const chartConfigCS = {
    items: {
      label: t("charts.chart_cs"),
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
            icon={BoxIcon}
            title={t("cards.inventory_value_title")}
            icond={null}
            number={100000}
            format={true}
            color="#FFC107"
          />
          <CardInfoNumber
            icon={ShoppingCar}
            title={t("cards.sales_title") + ": 10"}
            icond={null}
            number={1500}
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
          </div>
          <div className="w-full h-[500px] p-4 gap-1 border-2 border-[#b3b3b3] rounded-[10px] bg-transparent flex flex-col">
            <p className="font-semibold mb-2 dark:text-white">
              {t("reports.table2")}
            </p>
            <DataTable columns={columnss} data={dataTableS} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ReportsSales;
