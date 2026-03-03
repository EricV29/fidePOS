import React, { useEffect, useMemo, useState } from "react";
import { DataTableSearch } from "@components/data-table-search";
import { columnsPC } from "@columns/columnsPC";
import type { PaymentsCustomer, CustomersSelect } from "@typesm/customers";
import { columnsDC } from "@columns/columnsDC";
import type { DebtsCustomer } from "@typesm/customers";
import CustomSelect from "@components/Select";
import CardInfoNumber from "@components/CardInfoNumber";
import FlagIcon from "@icons/FlagIcon";
import InvestmentIcon from "@icons/InvestmentIcon";
import { useTranslation } from "react-i18next";
import { ModalNewPayment } from "@/components/modals/ModalNewPayment";
import { useModal } from "@context/ModalContext";

interface CustomersPaymentsProps {}

//* Example data products
const dataDCDB = [
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

const dataPaymentsCustomersDB = [
  {
    id: "34234",
    created_at: "01/01/2025",
    code_sku: "SFAS34",
    product: "Carrito2",
    note: "La siguiente semana liquida",
    amount: 40,
  },
];

const CustomersPayments: React.FC<CustomersPaymentsProps> = ({}) => {
  const [dataPaymentsCustomers, setPaymentsCustomers] = useState<
    PaymentsCustomer[]
  >([]);
  const { t, i18n } = useTranslation();
  const { setModal } = useModal();
  const [customersSelect, setCustomersSelect] = useState<CustomersSelect[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<
    string | undefined
  >();
  const [customerDebtNumberCard, setCustomerDebtsNumberCard] = useState(0);
  const [customerPaymentsNumberCard, setCustomerPaymentsNumberCard] =
    useState(0);
  const [customerTotalDebtAmountCard, setCustomerTotalDebtAmountCard] =
    useState(0);
  const [customerTotalPaymentAmount, setCustomerTotalPaymentAmount] =
    useState(0);
  const [paginationDebtsTable, setPaginationDebtsTable] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [customerDebts, setCustomerDebts] = useState<DebtsCustomer[]>([]);
  const [totalRowsDebtTable, setTotalRowsDebtsTable] = useState(0);

  const loadCustomersPayments = async () => {
    const response = await window.electronAPI.getCustomersPaymentsData();
    const customersPaymentsData =
      typeof response.result === "string"
        ? JSON.parse(response.result)
        : response.result;

    if (customersPaymentsData.customersSelect) {
      const customersSelect = customersPaymentsData.customersSelect.result;
      setCustomersSelect(customersSelect);
    }
  };

  useEffect(() => {
    loadCustomersPayments();
    setPaymentsCustomers(dataPaymentsCustomersDB);
  }, []);

  const loadSelectedCustomerData = async (id: string) => {
    const limitDebts = paginationDebtsTable.pageSize;
    const offsetDebts =
      paginationDebtsTable.pageIndex * paginationDebtsTable.pageSize;

    const data = { id, limitDebts, offsetDebts };

    const response = await window.electronAPI.getSelectedCustomerData(data);

    const customerData =
      typeof response.result === "string"
        ? JSON.parse(response.result)
        : response.result;

    if (customerData.customerDebtsNumber) {
      const customerDebtsNumber = customerData.customerDebtsNumber.result;
      setCustomerDebtsNumberCard(customerDebtsNumber[0].customerDebtsNumber);
    }

    if (customerData.customerPaymentsNumber) {
      const customerPaymentsNumber = customerData.customerPaymentsNumber.result;
      setCustomerPaymentsNumberCard(
        customerPaymentsNumber[0].customerPaymentsNumber,
      );
    }

    if (customerData.customerTotalDebtAmount) {
      const customerTotalDebtAmount =
        customerData.customerTotalDebtAmount.result;

      setCustomerTotalDebtAmountCard(
        customerTotalDebtAmount[0].customerTotalDebtAmount,
      );
    }

    if (customerData.customerTotalPaymentAmount) {
      const customerTotalPaymentAmount =
        customerData.customerTotalPaymentAmount.result;

      setCustomerTotalPaymentAmount(
        customerTotalPaymentAmount[0].customerTotalPaymentAmount,
      );
    }

    if (customerData.customerDebts) {
      const customerDebts = customerData.customerDebts.result;
      setCustomerDebts(customerDebts);
      setTotalRowsDebtsTable(customerData.customerDebts.totalCount);
    }
  };

  const customerOptions = useMemo(() => {
    return customersSelect.map((c) => ({
      label: `${c.name} ${c.last_name}`,
      value: c.id?.toString(),
    }));
  }, [customersSelect]);

  const handleChangeCustomer = (value: string) => {
    if (!value || value === selectedCustomerId) {
      setSelectedCustomerId(undefined);
    } else {
      setSelectedCustomerId(value);
    }

    loadSelectedCustomerData(value);
  };

  const columnsdc = columnsDC(t, i18n.language);
  const columnspc = columnsPC(t, i18n.language);

  return (
    <>
      <div className="w-full h-full flex flex-col gap-2">
        <CustomSelect
          options={customerOptions}
          placeholder={t("customers.input1")}
          color="#F57C00"
          value={selectedCustomerId}
          onChange={handleChangeCustomer}
        />
        <div className="flex gap-2 h-[100px]">
          <CardInfoNumber
            icon={null}
            title={t("cards.debts_title")}
            icond={FlagIcon}
            number={customerDebtNumberCard}
            format={false}
            color="#D32F2F"
          />
          <CardInfoNumber
            icon={null}
            title={t("cards.paids_title")}
            icond={FlagIcon}
            number={customerPaymentsNumberCard}
            format={false}
            color="#43A047"
          />
          <CardInfoNumber
            icon={InvestmentIcon}
            title={t("cards.unpaid_title")}
            icond={null}
            number={customerTotalDebtAmountCard}
            format={true}
            color="#D32F2F"
          />
          <CardInfoNumber
            icon={InvestmentIcon}
            title={t("cards.paid_title")}
            icond={null}
            number={customerTotalPaymentAmount}
            format={true}
            color="#43A047"
          />
        </div>
        <div className="w-full min-w-0 h-full min-h-0 flex gap-2">
          <div className="w-1/2 min-h-0 min-w-0 flex flex-col flex-1 p-4 gap-4 border-2 border-[#b3b3b3] rounded-[10px] bg-trasnparent">
            <p className="font-semibold dark:text-white">
              {t("customers.table2")}
            </p>
            <DataTableSearch
              data={customerDebts}
              columns={columnsdc}
              page="customersPayments"
              pagination={paginationDebtsTable}
              setPagination={setPaginationDebtsTable}
              totalRows={totalRowsDebtTable}
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
          <div className="w-1/2 min-h-0 min-w-0 flex flex-col flex-1 p-4 gap-4 border-2 border-[#b3b3b3] rounded-[10px] bg-transparent">
            <p className="font-semibold dark:text-white">
              {t("customers.table3")}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomersPayments;
