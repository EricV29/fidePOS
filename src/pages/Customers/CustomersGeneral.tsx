import React, { useEffect, useState } from "react";
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

const CustomersGeneral: React.FC<CustomersGeneralProps> = ({}) => {
  const [dataCustomers, setCustomers] = useState<Customers[]>([]);
  const { t, i18n } = useTranslation();
  const { setModal } = useModal();

  useEffect(() => {
    setCustomers(dataCustomersDB);
  }, []);

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
            number={124}
            format={false}
            color="#43A047"
          />
          <CardInfoNumber
            icon={null}
            title={t("cards.customers_debt_title")}
            icond={UserMinusIcon}
            number={36}
            format={false}
            color="#D32F2F"
          />
          <CardInfoNumber
            icon={InvestmentIcon}
            title={t("cards.owed_title")}
            icond={null}
            number={12000}
            format={true}
            color="#D32F2F"
          />
          <CardInfoText
            icon={null}
            title={t("cards.payment_title")}
            icond={null}
            text="Eric Villeda"
            date="2025-11-16T00:00:00Z"
            color="#43A047"
          />
        </div>
        <div className="w-full min-h-0 flex flex-col flex-1 p-4 gap-4 border-2 border-[#b3b3b3] rounded-[10px] bg-white">
          <p className="font-semibold">{t("customers.table1")}</p>
          <DataTableSearch
            data={dataCustomers}
            columns={columnsc}
            actions={{
              onEdit: (row) => {
                setModal(<ModalAddCustomer data={row} />);
              },
              onDelete: (row) => {
                deleteCustomer(row.id);
              },
            }}
          />
        </div>
      </div>
    </>
  );
};

export default CustomersGeneral;
