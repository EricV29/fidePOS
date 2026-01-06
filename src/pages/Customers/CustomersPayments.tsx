import React, { useEffect, useState } from "react";
import { DataTableSearch } from "@components/data-table-search";
import { columnsPC } from "@columns/columnsPC";
import type { PaymentsCustomer } from "@typesm/customers";
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

const optionsCustomers = [
  { label: "Eric Villeda Reyes", value: "idcustomer1" },
  { label: "Jared Villeda Reyes", value: "idcustomer2" },
];

const CustomersPayments: React.FC<CustomersPaymentsProps> = ({}) => {
  const [dataDebtCustomer, setDebtCustomer] = useState<DebtsCustomer[]>([]);
  const [dataPaymentsCustomers, setPaymentsCustomers] = useState<
    PaymentsCustomer[]
  >([]);
  const { t, i18n } = useTranslation();
  const { setModal } = useModal();

  useEffect(() => {
    setDebtCustomer(dataDCDB);
    setPaymentsCustomers(dataPaymentsCustomersDB);
  }, []);

  const columnsdc = columnsDC(t, i18n.language);
  const columnspc = columnsPC(t, i18n.language);

  return (
    <>
      <div className="w-full h-full flex flex-col gap-2">
        <CustomSelect
          options={optionsCustomers}
          placeholder={t("customers.input1")}
          color="#F57C00"
        />
        <div className="flex gap-2 h-[100px]">
          <CardInfoNumber
            icon={null}
            title={t("cards.debts_title")}
            icond={FlagIcon}
            number={5}
            format={false}
            color="#D32F2F"
          />
          <CardInfoNumber
            icon={null}
            title={t("cards.paids_title")}
            icond={FlagIcon}
            number={5}
            format={false}
            color="#43A047"
          />
          <CardInfoNumber
            icon={InvestmentIcon}
            title={t("cards.unpaid_title")}
            icond={null}
            number={500}
            format={true}
            color="#D32F2F"
          />
          <CardInfoNumber
            icon={InvestmentIcon}
            title={t("cards.paid_title")}
            icond={null}
            number={500}
            format={true}
            color="#43A047"
          />
        </div>
        <div className="w-full min-w-0 h-full min-h-0 flex gap-2">
          <div className="w-1/2 min-h-0 min-w-0 flex flex-col flex-1 p-4 gap-4 border-2 border-[#b3b3b3] rounded-[10px] bg-white">
            <p className="font-semibold">{t("customers.table2")}</p>
            <DataTableSearch
              data={dataDebtCustomer}
              columns={columnsdc}
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
          <div className="w-1/2 min-h-0 min-w-0 flex flex-col flex-1 p-4 gap-4 border-2 border-[#b3b3b3] rounded-[10px] bg-white">
            <p className="font-semibold">{t("customers.table3")}</p>
            <DataTableSearch data={dataPaymentsCustomers} columns={columnspc} />
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomersPayments;
