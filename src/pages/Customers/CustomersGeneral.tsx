import React, { useCallback, useEffect, useState } from "react";
import CardInfoNumber from "@components/CardInfoNumber";
import CardInfoText from "@components/CardInfoText";
import UserMinusIcon from "@icons/UserMinusIcon";
import UsersIcon from "@icons/UsersIcon";
import { DataTableSearch } from "@components/data-table-search";
import { columnsC } from "@columns/columnsC";
import type { Customers } from "@typesm/customers";
import InvestmentIcon from "@icons/InvestmentIcon";
import { useTranslation } from "react-i18next";
import { ModalAddCustomer } from "@components/modals/ModalAddCustomer";
import { useModal } from "@context/ModalContext";

interface CustomersGeneralProps {}

//* Example data products
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

const CustomersGeneral: React.FC<CustomersGeneralProps> = () => {
  const { t, i18n } = useTranslation();
  const { setModal } = useModal();
  const [customersNumberCard, setCustomersNumberCard] = useState(0);
  const [customersInDebtNumberCard, setCustomersInDebtNumberCard] = useState(0);
  const [totalDebtAmountCard, setTotalDebtAmountCard] = useState(0);
  const [lastCustomerNamePaidCard, setLastCustomerNamePaidCard] = useState("");
  const [lastCustomerNamePaidCardDate, setLastCustomerNamePaidCardDate] =
    useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [totalRows, setTotalRows] = useState(0);
  const [customerTable, setCustomerTable] = useState<Customers[]>([]);

  const loadCustomerGeneral = useCallback(async () => {
    const limit = pagination.pageSize;
    const offset = pagination.pageIndex * pagination.pageSize;
    const response = await window.electronAPI.getCustomersGeneralData({
      limit: limit,
      offset: offset,
    });

    const customerGeneralData =
      typeof response.result === "string"
        ? JSON.parse(response.result)
        : response.result;

    if (customerGeneralData.customersNumber) {
      const customersNumber = customerGeneralData.customersNumber.result;
      setCustomersNumberCard(customersNumber[0].customersNumber);
    }

    if (customerGeneralData.customersInDebtNumber) {
      const customersInDebtNumber =
        customerGeneralData.customersInDebtNumber.result;
      setCustomersInDebtNumberCard(
        customersInDebtNumber[0].customersInDebtNumber,
      );
    }

    if (customerGeneralData.totalDebtAmount) {
      const totalDebtAmount = customerGeneralData.totalDebtAmount.result;
      setTotalDebtAmountCard(totalDebtAmount[0].totalDebtAmount);
    }

    if (customerGeneralData.lastCustomerNamePaid) {
      const lastCustomerNamePaid =
        customerGeneralData.lastCustomerNamePaid.result;
      setLastCustomerNamePaidCard(lastCustomerNamePaid[0].lastCustomerNamePaid);
      setLastCustomerNamePaidCardDate(lastCustomerNamePaid[0].created_at);
    }

    if (customerGeneralData?.customersTable) {
      const customersData = customerGeneralData.customersTable.result;
      setCustomerTable(customersData);
      setTotalRows(customerGeneralData.customersTable.totalCount);
    }
  }, [pagination]);

  useEffect(() => {
    loadCustomerGeneral();
  }, [loadCustomerGeneral]);

  const columnsc = columnsC(t, i18n.language);

  function deleteCustomer(id: string) {
    console.log("Deleting customer:", id);
  }

  return (
    <>
      <div className="w-full h-full flex flex-col gap-2">
        <div className="flex gap-2 h-[120px]">
          <CardInfoNumber
            icon={null}
            title={t("cards.customers_title")}
            icond={UsersIcon}
            number={customersNumberCard}
            format={false}
            color="#43A047"
          />
          <CardInfoNumber
            icon={null}
            title={t("cards.customers_debt_title")}
            icond={UserMinusIcon}
            number={customersInDebtNumberCard}
            format={false}
            color="#D32F2F"
          />
          <CardInfoNumber
            icon={InvestmentIcon}
            title={t("cards.owed_title")}
            icond={null}
            number={totalDebtAmountCard}
            format={true}
            color="#D32F2F"
          />
          <CardInfoText
            icon={null}
            title={t("cards.payment_title")}
            icond={null}
            text={lastCustomerNamePaidCard}
            date={lastCustomerNamePaidCardDate}
            color="#43A047"
          />
        </div>
        <div className="w-full min-h-0 flex flex-col flex-1 p-4 gap-4 border-2 border-[#b3b3b3] rounded-[10px] bg-transparent">
          <p className="font-semibold dark:text-white">
            {t("customers.table1")}
          </p>
          <DataTableSearch
            data={customerTable}
            columns={columnsc}
            page={"customersGeneral"}
            pagination={pagination}
            setPagination={setPagination}
            totalRows={totalRows}
            actions={{
              onEdit: (row) => {
                setModal(
                  <ModalAddCustomer
                    data={row}
                    onSuccess={loadCustomerGeneral}
                  />,
                );
              },
              onDelete: (row) => {
                setModal(<ModalAddCustomer onSuccess={() => {}} />);
              },
            }}
          />
        </div>
      </div>
    </>
  );
};

export default CustomersGeneral;
