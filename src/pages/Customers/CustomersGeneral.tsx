import React, { useEffect, useState } from "react";
import CardInfoNumber from "@/components/CardInfoNumber";
import CardInfoText from "@/components/CardInfoText";
import UserMinusIcon from "@/assets/icons/UserMinusIcon";
import UsersIcon from "@/assets/icons/UsersIcon";
import { DataTableSearch } from "@/components/data-table-search";
import { columnsC } from "@/components/columns/columnsC";
import type { Customers } from "@/types/customers";
import InvestmentIcon from "@/assets/icons/InvestmentIcon";

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

  useEffect(() => {
    setCustomers(dataCustomersDB);
  }, []);

  return (
    <>
      <div className="w-full h-full flex flex-col gap-2">
        <div className="flex gap-2 h-[120px]">
          <CardInfoNumber
            icon={null}
            title="Customers"
            icond={UsersIcon}
            number={124}
            format={false}
            color="#43A047"
          />
          <CardInfoNumber
            icon={null}
            title="Customers in Debt"
            icond={UserMinusIcon}
            number={36}
            format={false}
            color="#D32F2F"
          />
          <CardInfoNumber
            icon={InvestmentIcon}
            title="Total Owed"
            icond={null}
            number={12000}
            format={true}
            color="#D32F2F"
          />
          <CardInfoText
            icon={null}
            title="Last Payment"
            icond={null}
            text="Eric Villeda"
            date="01/01/2025"
            color="#43A047"
          />
        </div>
        <div className="w-full min-h-0 flex flex-col flex-1 p-4 gap-4 border-2 border-[#b3b3b3] rounded-[10px] bg-white">
          <p className="font-semibold">Customers Table</p>
          <DataTableSearch
            data={dataCustomers}
            columns={columnsC}
            actions={{
              view: true,
              edit: true,
              delete: true,
            }}
          />
        </div>
      </div>
    </>
  );
};

export default CustomersGeneral;
