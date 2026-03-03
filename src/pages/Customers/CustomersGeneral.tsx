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
import AUTH_CODES from "../../../constants/authCodes.json";
import { useLoading } from "@context/LoadingContext";

interface CustomersGeneralProps {}

const CustomersGeneral: React.FC<CustomersGeneralProps> = () => {
  const { t, i18n } = useTranslation();
  const { setModal, triggerResponseAlert, triggerWarningAlert } = useModal();
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
  const { setLoading } = useLoading();

  const loadCustomerGeneral = useCallback(async () => {
    const limit = pagination.pageSize;
    const offset = pagination.pageIndex * pagination.pageSize;
    const response = await window.electronAPI.getCustomersGeneralData({
      limit: limit,
      offset: offset,
    });

    const customersGeneralData =
      typeof response.result === "string"
        ? JSON.parse(response.result)
        : response.result;

    if (customersGeneralData.customersNumber) {
      const customersNumber = customersGeneralData.customersNumber.result;
      setCustomersNumberCard(customersNumber[0].customersNumber);
    }

    if (customersGeneralData.customersInDebtNumber) {
      const customersInDebtNumber =
        customersGeneralData.customersInDebtNumber.result;
      setCustomersInDebtNumberCard(
        customersInDebtNumber[0].customersInDebtNumber,
      );
    }

    if (customersGeneralData.totalDebtAmount) {
      const totalDebtAmount = customersGeneralData.totalDebtAmount.result;
      setTotalDebtAmountCard(totalDebtAmount[0].totalDebtAmount);
    }

    if (customersGeneralData.lastCustomerNamePaid) {
      const lastCustomerNamePaid =
        customersGeneralData.lastCustomerNamePaid.result;
      setLastCustomerNamePaidCard(lastCustomerNamePaid[0].lastCustomerNamePaid);
      setLastCustomerNamePaidCardDate(lastCustomerNamePaid[0].created_at);
    }

    if (customersGeneralData?.customersTable) {
      const customersData = customersGeneralData.customersTable.result;
      setCustomerTable(customersData);
      setTotalRows(customersGeneralData.customersTable.totalCount);
    }
  }, [pagination]);

  useEffect(() => {
    loadCustomerGeneral();
  }, [loadCustomerGeneral]);

  const columnsc = columnsC(t, i18n.language);

  const deleteCustomer = async (id: number, status: string) => {
    console.log("Deleting customer:", id, status);
    if (status !== "active" && status !== "debt") {
      triggerResponseAlert(AUTH_CODES.INACTIVE_CUSTOMER);
      return;
    }

    if (status === "debt") {
      triggerResponseAlert(AUTH_CODES.DEBT_CUSTOMER);
      return;
    }

    triggerWarningAlert(
      t("modalWarningAlert.text_delete_customer"),
      async () => {
        try {
          setLoading(true);
          const response = await window.electronAPI.deleteCustomer(id);
          if (response.success) {
            loadCustomerGeneral();
            setLoading(false);
            triggerResponseAlert(response.result);
          } else {
            setLoading(false);
            triggerResponseAlert(response.error);
          }
        } catch (err) {
          console.error("Comunication Error:", err);
        }
      },
    );
  };

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
                deleteCustomer(Number(row.id), row.status);
              },
            }}
          />
        </div>
      </div>
    </>
  );
};

export default CustomersGeneral;
