import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import CardInfoNumber from "@components/CardInfoNumber";
import ChartPieDonutText from "@components/chart-pie-donut";
import { addRandomFill } from "@utility/AddFill";
import { DataTable } from "@components/data-table";
import { columnsC } from "@columns/columnsC";
import type { Customers } from "@typesm/customers";
import { columnsDC } from "@columns/columnsDC";
import type { DebtsCustomer } from "@typesm/customers";
import { columnsPC } from "@columns/columnsPC";
import type { PaymentsCustomer } from "@typesm/customers";
import CardInfoDetail from "@components/CardInfoDetail";
import { DataTableSearch } from "@components/data-table-search";
import CustomSelect from "@components/Select";
import ChartAreaDefault from "@components/chart-area-default";
import InvestmentIcon from "@icons/InvestmentIcon";
import ShoppingCar from "@icons/ShoppingCar";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";

interface PieChartItem {
  fill: string;
  [key: string]: string | number;
}

export type dataPaymentI = {
  id: string;
  name: string;
  last_name: string;
  phone: string;
  status: string;
  created_at: string;
  actions?: {
    view?: boolean;
    delete?: boolean;
    edit?: boolean;
  };
};

//* Example data table

const dataCustomersDB = [
  {
    id: "728ed51f",
    name: "Eric",
    last_name: "Villeda",
    phone: "7713940793",
    status: "active",
    debts: 0,
    debts_amount: 0,
    debts_paid: 500,
    created_at: "03/03/2025",
  },
];

const dataCBD = [
  {
    id: "34234",
    code_sku: "ASD345",
    product: "Carrito",
    description: "Hotweels rojo",
    category: "toys",
    ccolor: "#ff49ff",
    status: "unpaid",
    debt_amount: 100,
    debt_paid: 50,
    created_at: "01/02/2025",
  },
  {
    id: "34234",
    code_sku: "ASD345",
    product: "Muñeco",
    description: "Max Steel",
    category: "toys",
    ccolor: "#ff49ff",
    status: "paid",
    debt_amount: 100,
    debt_paid: 100,
    created_at: "01/02/2025",
  },
];

const dataPaymentsDB = [
  {
    id: "34234",
    created_at: "01/01/2025",
    code_sku: "SFAS34",
    product: "Carrito2",
    note: "La siguiente semana liquida",
    amount: 40,
  },
];

const optionsCustomers = [
  { label: "Eric Villeda Reyes", value: "idcustomer1" },
  { label: "Jared Villeda Reyes", value: "idcustomer2" },
];

const optionsYears = [
  { label: "2025", value: "2025" },
  { label: "2026", value: "2026" },
];

export type dataExportReports = string | number | boolean | null | undefined;

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

interface dataGeneralI {
  [key: string]: number;
}

interface ReportsCustomersProps {}

const ReportsCustomers: React.FC<ReportsCustomersProps> = ({}) => {
  const [dataTableC, setDataTableC] = useState<Customers[]>([]);
  const [dataTableDC, setDataTableDC] = useState<DebtsCustomer[]>([]);
  const [dataTablePC, setDataTablePC] = useState<PaymentsCustomer[]>([]);
  const { t, i18n } = useTranslation();
  const { filters, childRef } = useOutletContext<ReportsContext>();

  //* GET DATA
  const [pendingAmountCard, setPendingAmountCard] = useState(Number);
  const [salesNumberCard, setSalesNumberCard] = useState(Number);
  const [salesAmountCard, setSalesAmountCard] = useState(Number);
  const [customersStatus, setCustomersStatus] = useState<dataGeneralI>();
  const [debtsByCustomers, setDebtsByCustomers] = useState<PieChartItem[]>([]);
  const [debtsOverTime, setDebtsOverTime] = useState<[]>([]);

  const loadReportsGeneral = useCallback(
    async (currentFilters = filters) => {
      //setLoading(true);
      const response =
        await window.electronAPI.getReportsCustomersData(currentFilters);
      const reportsCustomersData =
        typeof response.result === "string"
          ? JSON.parse(response.result)
          : response.result;

      if (reportsCustomersData?.salesPendingAmount) {
        const salesPendingAmountData =
          reportsCustomersData.salesPendingAmount.result;
        setPendingAmountCard(salesPendingAmountData[0].pendingSalesAmount);
      }

      if (reportsCustomersData?.salesNumberAmount) {
        const salesNumberAmountData =
          reportsCustomersData.salesNumberAmount.result;
        setSalesNumberCard(salesNumberAmountData.dataNumber[0].salesNumber);
        setSalesAmountCard(salesNumberAmountData.dataAmount[0].salesAmount);
      }

      if (reportsCustomersData?.customersStatus) {
        const customersStatusData = reportsCustomersData.customersStatus.result;
        setCustomersStatus(customersStatusData[0]);
      }

      if (reportsCustomersData?.debtsByCustomers) {
        const debtsByCustomersChartData =
          reportsCustomersData.debtsByCustomers.result;
        setDebtsByCustomers(addRandomFill(debtsByCustomersChartData));
      }
    },
    [filters],
  );

  useEffect(() => {
    loadReportsGeneral();
    setDataTableC(dataCustomersDB);
    setDataTableDC(dataCBD);
    setDataTablePC(dataPaymentsDB);
  }, []);

  const columnsc = columnsC(t, i18n.language);
  const columnsdc = columnsDC(t, i18n.language);
  const columnspc = columnsPC(t, i18n.language);

  const chartConfigDDC = {
    items: {
      label: t("placeholders.debt"),
    },
  };

  const chartConfigTDOT = {
    debts: {
      label: t("placeholders.debt"),
      color: "#F57C00",
    },
  };

  const handleSelectYear = async (value: string) => {
    console.log(value);
    const response = await window.electronAPI.getDebtsOverTime(value);
    const debtsOverTimeData =
      typeof response.result === "string"
        ? JSON.parse(response.result)
        : response.result;

    setDebtsOverTime(debtsOverTimeData);
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
            title={t("cards.pending_title")}
            icond={null}
            number={pendingAmountCard}
            format={true}
            color="#1976D2"
          />
          <CardInfoNumber
            icon={ShoppingCar}
            title={t("cards.sales_title") + `: ${salesNumberCard}`}
            icond={null}
            number={salesAmountCard}
            format={true}
            color="#1976D2"
          />
          <CardInfoDetail
            chartData={customersStatus!}
            title={t("cards.customers_title")}
            color="#1976D2"
          />
        </div>
        <div className="w-full h-auto flex-1 flex flex-col overflow-y-auto gap-2">
          <div className="w-full flex gap-2 h-[300px]">
            <div className="max-w-[300px] min-w-0 w-full h-full flex flex-col justify-center items-center p-5 gap-5 border-2 border-[#b3b3b3] rounded-[10px] bg-transparent">
              <p className="font-semibold dark:text-white">
                {t("reports.chart5")}
              </p>
              <ChartPieDonutText
                chartData={debtsByCustomers}
                chartConfig={chartConfigDDC}
              />
            </div>
            <div className=" min-w-0 w-full h-full flex flex-col justify-center items-center p-5 gap-5 border-2 border-[#b3b3b3] rounded-[10px] bg-transparent">
              <div className="w-full flex items-center justify-between">
                <p className="font-semibold dark:text-white">
                  {t("reports.chart6")}
                </p>
                <CustomSelect
                  options={optionsYears}
                  placeholder={t("reports.input2")}
                  color="#F57C00"
                  onChange={handleSelectYear}
                />
              </div>
              <ChartAreaDefault
                chartData={debtsOverTime}
                chartConfig={chartConfigTDOT}
              />
            </div>
          </div>
          <div className="w-full h-[500px] p-4 gap-1 border-2 border-[#b3b3b3] rounded-[10px] bg-transparent flex flex-col">
            <p className="font-semibold mb-2 dark:text-white">
              {t("reports.table4")}
            </p>
            <DataTable columns={columnsc} data={dataTableC} />
          </div>
          <CustomSelect
            options={optionsCustomers}
            placeholder={t("reports.input1")}
            color="#F57C00"
          />
          <div className="w-full min-w-0 flex gap-2">
            <div className="w-1/2 min-h-0 min-w-0 flex flex-col flex-1 p-4 gap-4 border-2 border-[#b3b3b3] rounded-[10px] bg-transparent">
              <p className="font-semibold dark:text-white">
                {t("reports.table5")}
              </p>
              {/* <DataTableSearch data={dataTableDC} columns={columnsdc} /> */}
            </div>
            <div className="w-1/2 min-h-0 min-w-0 flex flex-col flex-1 p-4 gap-4 border-2 border-[#b3b3b3] rounded-[10px] bg-transparent">
              <p className="font-semibold dark:text-white">
                {t("reports.table6")}
              </p>
              {/* <DataTableSearch data={dataTablePC} columns={columnspc} /> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReportsCustomers;
