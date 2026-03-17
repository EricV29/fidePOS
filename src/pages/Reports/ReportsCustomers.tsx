import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import CardInfoNumber from "@components/CardInfoNumber";
import ChartPieDonutText from "@components/chart-pie-donut";
import { addRandomFill } from "@utility/AddFill";
import { DataTable } from "@components/data-table";
import { columnsC } from "@columns/columnsC";
import type {
  Customers,
  DebtsCustomer,
  PaymentsCustomer,
  CustomersSelect,
} from "@typesm/customers";
import type {
  PieChartValue,
  ExportReportValue,
  CardInfoValue,
  ChartAreaValue,
} from "@typesm/global";
import { columnsDC } from "@columns/columnsDC";
import { columnsPC } from "@columns/columnsPC";
import CardInfoDetail from "@components/CardInfoDetail";
import CustomSelect from "@components/Select";
import ChartAreaDefault from "@components/chart-area-default";
import InvestmentIcon from "@icons/InvestmentIcon";
import ShoppingCar from "@icons/ShoppingCar";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";

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

const ReportsCustomers = () => {
  const { t, i18n } = useTranslation();
  const { filters, childRef } = useOutletContext<ReportsContext>();
  const optionsYears = [
    { label: "2025", value: "2025" },
    { label: "2026", value: "2026" },
  ];
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

  //* GET DATA
  const [pendingAmountCard, setPendingAmountCard] = useState(Number);
  const [salesNumberCard, setSalesNumberCard] = useState(Number);
  const [salesAmountCard, setSalesAmountCard] = useState(Number);
  const [customersStatus, setCustomersStatus] = useState<CardInfoValue>();
  const [debtsByCustomers, setDebtsByCustomers] = useState<PieChartValue[]>([]);
  const [debtsOverTime, setDebtsOverTime] = useState<ChartAreaValue[]>([]);
  const [customersTable, setCustomersTable] = useState<Customers[]>([]);
  const [customersSelect, setCustomersSelect] = useState<CustomersSelect[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<
    string | undefined
  >();

  const [year, setSelectYear] = useState<string | undefined>();

  const [customerDebts, setCustomerDebts] = useState<DebtsCustomer[]>([]);
  const [customerPayments, setCustomerPayments] = useState<PaymentsCustomer[]>(
    [],
  );

  const loadReportsCustomers = useCallback(
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
        setSalesNumberCard(salesNumberAmountData.salesNumber.salesNumber);
        setSalesAmountCard(salesNumberAmountData.salesAmount[0].salesAmount);
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

      if (reportsCustomersData?.customers) {
        const customersData = reportsCustomersData.customers.result;
        setCustomersTable(customersData);
      }

      if (reportsCustomersData.customersSelect) {
        const customersSelect = reportsCustomersData.customersSelect.result;
        setCustomersSelect(customersSelect);
      }

      setCustomerDebts([]);
      setCustomerPayments([]);
    },
    [filters],
  );

  useEffect(() => {
    loadReportsCustomers();
  }, [loadReportsCustomers]);

  const customerOptions = useMemo(() => {
    return customersSelect.map((c) => ({
      label: `${c.name} ${c.last_name}`,
      value: c.id?.toString(),
    }));
  }, [customersSelect]);

  const loadSelectedCustomerData = useCallback(
    async (id: string, currentFilters = filters) => {
      const data = { id, currentFilters };
      const response =
        await window.electronAPI.getSelectedCustomerDataDate(data);

      const customerData =
        typeof response.result === "string"
          ? JSON.parse(response.result)
          : response.result;

      if (customerData.customerDebts) {
        const customerDebts = customerData.customerDebts.result;
        setCustomerDebts(customerDebts);
      }

      if (customerData.customerPayments) {
        const customerDebts = customerData.customerPayments.result;
        setCustomerPayments(customerDebts);
      }
    },
    [filters],
  );

  const handleChangeCustomer = (value: string) => {
    if (!value || value === selectedCustomerId) {
      setSelectedCustomerId(undefined);
    } else {
      setSelectedCustomerId(value);
    }

    loadSelectedCustomerData(value);
  };

  const handleSelectYear = async (value: string) => {
    setSelectYear(value);
    const response = await window.electronAPI.getDebtsOverTime(value);
    const debtsOverTimeData =
      typeof response.result === "string"
        ? JSON.parse(response.result)
        : response.result;

    setDebtsOverTime(debtsOverTimeData);
  };

  useImperativeHandle(childRef, () => ({
    createReport: async () => {
      const customersData: Customers[] = customersTable;
      const customersDebetsData: DebtsCustomer[] = customerDebts;
      const customersPaymentsData: PaymentsCustomer[] = customerPayments;

      let totalCustomer = 0;
      if (customersStatus) {
        totalCustomer =
          Number(customersStatus.Active || 0) +
          Number(customersStatus["In Debt"] || 0);
      }

      const statsData = [
        [t("exportReport.reports_customers.title")],
        [
          t("exportReport.reports_customers.total_receivable"),
          pendingAmountCard,
        ],
        [t("exportReport.reports_customers.sale_num"), salesNumberCard],
        [t("exportReport.reports_customers.sale_amount"), salesAmountCard],
        [t("exportReport.reports_customers.customer_total_num"), totalCustomer],
        [
          t("exportReport.reports_customers.customer_active"),
          customersStatus?.Active,
        ],
        [
          t("exportReport.reports_customers.customer_inactive"),
          customersStatus?.["In Debt"],
        ],
        [],
      ];

      // Table 1 -> Debt Distribution by Customer (DDC)
      const tableHeadersDDC = [t("columns.customers"), t("columns.debts")];
      const rowsDDC = debtsByCustomers.map((x) => [x.customer, x.debts]);

      // Table 2 -> Total Debt Over Time (TDOT)
      const tableHeadersTDOT = [t("columns.month"), t("columns.debts")];
      const rowsTDOT = debtsOverTime.map((x) => [x.month, x.debts]);

      // Table 3 -> Customer Table (CT)
      const tableHeadersCT = [
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

      const rowsCT = customersData.map((x) => [
        x.id,
        x.name,
        x.last_name,
        x.phone,
        x.status,
        x.debts_number,
        x.debts_amount,
        x.debts_paid,
        x.created_at,
      ]);

      // Table 4 -> Debts Table (DT)
      const tableHeadersDT = [
        "ID",
        t("columns.sale_num"),
        t("columns.code_sku"),
        t("columns.product"),
        t("columns.description"),
        t("columns.debt_amount"),
        t("columns.sale_amount"),
        t("columns.debt_paid"),
        t("columns.created_at"),
      ];

      const rowsDT = customersDebetsData.map((x) => [
        x.id,
        x.sale_num,
        x.codes_sku,
        x.products,
        x.descriptions,
        x.debt_amount,
        x.sale_total,
        x.debt_paid,
        x.created_at,
      ]);

      // Table 4 -> Payments Table (PT)
      const tableHeadersPT = [
        "ID",
        t("columns.created_at"),
        t("columns.sale_num"),
        t("columns.total_payment_amount"),
        t("columns.note"),
      ];

      const rowsPT = customersPaymentsData.map((x) => [
        x.id,
        x.created_at,
        x.sale_num,
        x.amount,
        x.note,
      ]);

      const finalData: ExportReportValue[][] = [
        ...statsData,
        [],
        [t("exportReport.reports_customers.debt_distribution_customer")],
        tableHeadersDDC,
        ...rowsDDC,
        [],
        [t("exportReport.reports_customers.total_debt_over_time")],
        [t("exportReport.reports_customers.year")],
        [year],
        tableHeadersTDOT,
        ...rowsTDOT,
        [],
        [t("exportReport.reports_customers.detail_customers")],
        tableHeadersCT,
        ...rowsCT,
        [],
        [t("exportReport.reports_customers.detail_customer")],
        [t("exportReport.reports_customers.customer")],
        [selectedCustomerId],
        [t("exportReport.reports_customers.detail_debts")],
        tableHeadersDT,
        ...rowsDT,
        [],
        [t("exportReport.reports_customers.detail_payments")],
        tableHeadersPT,
        ...rowsPT,
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
                  value={year}
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
            <DataTable columns={columnsc} data={customersTable} />
          </div>
          <CustomSelect
            options={customerOptions}
            placeholder={t("customers.input1")}
            color="#F57C00"
            value={selectedCustomerId}
            onChange={handleChangeCustomer}
          />
          <div className="w-full min-w-0 flex gap-2">
            <div className="w-1/2 min-h-0 min-w-0 flex flex-col flex-1 p-4 gap-4 border-2 border-[#b3b3b3] rounded-[10px] bg-transparent">
              <p className="font-semibold dark:text-white">
                {t("reports.table5")}
              </p>
              <DataTable data={customerDebts} columns={columnsdc} />
            </div>
            <div className="w-1/2 min-h-0 min-w-0 flex flex-col flex-1 p-4 gap-4 border-2 border-[#b3b3b3] rounded-[10px] bg-transparent">
              <p className="font-semibold dark:text-white">
                {t("reports.table6")}
              </p>
              <DataTable data={customerPayments} columns={columnspc} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReportsCustomers;
